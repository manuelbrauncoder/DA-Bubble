/**
 * This service is for handling firebase Authentication
 */

import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getRedirectResult,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { from, Observable, Subscription } from 'rxjs';
import { AuthUser } from '../interfaces/auth-user';
import { FirestoreService } from './firestore.service';
import { UserInterface } from '../interfaces/user-interface';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  fireService = inject(FirestoreService);
  provider = new GoogleAuthProvider;
  auth = inject(Auth);
  user$ = user(this.auth);

  currentUserSig = signal<AuthUser | null | undefined>(undefined);

  //currentUser = this.auth.currentUser;

  constructor() { 
  }

  

  /**
   * not working yet
   */
  signInWithGoogle() {
    signInWithRedirect(this.auth, this.provider)
  }

  /**
   * not working yet
   */
  handleGoogleSignInRedirect() {

    getRedirectResult(this.auth).then((result) => {
      if (result) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log(credential, token, user);

      }
    }).catch((err) => {
      const errorCode = err.code;
      const errorMessage = err.message;
      const email = err.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(err);
      console.warn(errorCode, errorMessage, email, credential);
    })
  }

  /**
   * Registers a new user with Firebase Authentication.
   *
   * This function creates a new user account with the provided email and password.
   * After successfully registering, it updates the user's profile with the provided username (displayName) and
   * save the new user with the uid in firestore
   *
   * @param {string} email
   * @param {string} username 
   * @param {string} password 
   * @returns {Observable<void>} An observable that completes when the user is successfully registered and the profile is updated.
   */
  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password).then((response) => {
      updateProfile(response.user, { displayName: username });
      this.saveNewUserInFirestore(email, username, response.user.uid);
      this.currentUserSig.set({
        email: response.user.email!,
        username: response.user.displayName!,
        uid: response.user.uid!
      })
    })
    .catch((err) => {
      console.log('Error register new User', err);
    });
    return from(promise);
  }

  saveNewUserInFirestore(email: string, username: string, uid: string) {
    let newUser = {
      uid: uid,
      username: username,
      email: email,
      createdAt: this.getCurrentTimestamp(),
      currentlyLoggedIn: true
    }
    this.fireService.addUser(newUser);
  }

  getCurrentTimestamp() {
    const now = new Date();
    return now.getTime();
  }

  /**
  * Logs in a user with Firebase Authentication.
  *
  * If the login is successful, it changes the login state in firestore
  *
  * @param {string} email 
  * @param {string} password 
  * @returns {Observable<void>} An observable that completes when the login process is successful.
  */
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, password)
      .then((response) => {
        this.changeLoginState(true, response.user.uid);
      })
      .catch((error) => {
        console.error('Login failed in FirebaseAuthService:', error);
        throw error;
      });
  
    return from(promise);
  }

  /**
   * changes login state in firestore
   * call this method after login and logout
   * 
   * @param loggedInState true after login, false after logout
   * @param uid 
   */
  changeLoginState(loggedInState: boolean, uid: string) {
    this.fireService.users.forEach((user) => {
      if (uid === user.uid) {
        user.currentlyLoggedIn = loggedInState;
        this.fireService.updateUser(user);
      }
    })
  }

  /**
   * this method logs out the current user
   * and change the login state in firestore
   * @returns an observable that completes when logout is successful.
   */
  logout(): Observable<void> {
    const currentUserUid = this.currentUserSig()?.uid;
    const promise = signOut(this.auth).then(() => {
      this.changeLoginState(false, currentUserUid!);
    }).catch((err) => {
      console.log('Error logging User out', err);

    });
    return from(promise);
  }

  /**
   * call this method for guest login
   */
  guestLogin() {
    const guestEmail = 'guest@gmail.com';
    const guestPw = '123456'
    this.login(guestEmail, guestPw);
  }

  /**
   * call this method to sign up guest
   * only once needed
   */
  guestSignUp() {
    const guestEmail = 'guest@gmail.com';
    const guestPw = '123456'
    const userName = 'Guest'
    this.register(guestEmail, userName, guestPw);
  }

  /**
   * this method deletes the currently logged in user account.
   * then it deletes the user in firestore
   */
  deleteUserAccount(){
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      deleteUser(currentUser).then(()=>{
        console.log('User deleted', currentUser);
        this.deleteUserInFirestore(currentUser.uid);
      }).catch((err)=>{
        console.log('Error deleting User', err);
      });
    } else {
      console.log('No user is currently logged in.');
      
    }
  }

  /**
   * deletes the user with uid in firestore
   * @param uid 
   */
  deleteUserInFirestore(uid: string){
    this.fireService.users.forEach((user) => {
      if (uid === user.uid) {
        this.fireService.deleteDocument(user.id, 'users');
      } 
    })
  }

   /**
   * This method is for updating the users email
   * If the last login was too long ago, the user has to be re-authenticate
   * We need a popup, where the user can log in again
   * in this popup, call the reAuthenticateUser() method
   * after that, the user can update his email
   * @param newEmail 
   */
  updateUserEmail(newEmail: string){
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      updateEmail(currentUser, newEmail).then(()=>{
        this.fireService.users.forEach((user) => {
          if (currentUser.uid === user.uid) {
            user.email = newEmail;
            this.fireService.updateUser(user);
          }
        })
      }).catch((err) => {
        let code = AuthErrorCodes.EMAIL_CHANGE_NEEDS_VERIFICATION;
        if (code) {
          //this.verifyUsersEmail();
          alert('Please verify your email before updating it');
          
        }
        console.log(err);
        
      });
    }
  }

  /**
   * This method sends a Email to the current User
   * If the user clicks on the link in it, his email is verified
   */
  verifyUsersEmail(){
    if (this.auth.currentUser) {
      sendEmailVerification(this.auth.currentUser).then(()=>{
        console.log('email sent!');  
      }).catch((err)=>{
        console.warn('Error sending Email', err);
      })
    }
  }

  /**
   * This method is for reauthenticate the user
   */
  reAuthenticateUser(email: string, password: string){
    const credential = EmailAuthProvider.credential(email, password);
    if (this.auth.currentUser) {
      reauthenticateWithCredential(this.auth.currentUser, credential).then(()=>{}).catch((err)=>{console.warn('Error', err)});
    }
  }

  /**
   * This method is for updating the users password
   * If the last login was too long ago, the user has to be re-authenticate
   * We need a popup, where the user can log in again
   * in this popup, call the reAuthenticateUser() method
   * after that, the user can update his password
   * @param newPw 
   */
  updateUserPassword(newPw: string) {
    if (this.auth.currentUser) {
      updatePassword(this.auth.currentUser, newPw).then(() => {
        // add things todo after password changed
        console.log('Password from User updated:', this.auth.currentUser);
      }).catch((err) => {
        let code = AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN
        if (code) {
          console.log('Login again before change password');
          // add popup to reAuthentcateUser();
        }
        console.warn('Error updating Password', err);
      })
    }
  }

}
