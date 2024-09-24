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
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  signInWithPopup
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { AuthUser } from '../interfaces/auth-user';
import { FirestoreService } from './firestore.service';
import { UiService } from './ui.service';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  fireService = inject(FirestoreService);
  provider = new GoogleAuthProvider;
  auth = inject(Auth);
  user$ = user(this.auth);
  uiService = inject(UiService);
  newEmailAddress: string = '';
  updateEmail: boolean = false;
  loginTooLongAgo: boolean = false;
  googleUser: boolean = false;
  guestUser: boolean = false;

  currentUserSig = signal<AuthUser | null | undefined>(undefined);

  constructor(private router: Router, private firestore: Firestore) {
  }


  /**
  * Stored Data from Registration Form 
  */
  private tempRegData: { email: string; username: string; password: string } | null = null;

  storeRegistrationData(email: string, username: string, password: string) {
    this.tempRegData = { email, username, password };
  }

  /**
  * Get the stored data
  */
  getStoredRegistrationData() {
    return this.tempRegData;
  }

  /**
  * Delete the stored data 
  */
  clearStoredRegistrationData() {
    this.tempRegData = null;
  }

  /**
   * Google Login with a popup
   * Checks if user is already in the database or not
   * If not then saves a new user. If yes then update the data.
   */
  googleLogin() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider).then(async (result) => {
      const user = result.user;
      this.googleUser = true;
  
      if (user) {        
        const userData = {
          uid: user.uid,
          username: user.displayName || 'No Username',
          email: user.email || 'No Email',
          avatar: user.photoURL || 'default-avatar-url',
          currentlyLoggedIn: true,
          createdAt: this.getCurrentTimestamp(),
        };
  
        let userExists = false;
  
        this.fireService.users.forEach((firestoreUser) => {
          if (user.uid === firestoreUser.uid) {
            this.fireService.addUser(userData);
            userExists = true;
          }
        });
  
        if (!userExists) {
          this.fireService.addUser(userData);
        }
      }
    }).catch((error) => {
      console.error('Google sign-in error:', error);
    });
  }

  /**
   * Google Login with a redirect
   */
  googleLoginRedirect() {
    const provider = new GoogleAuthProvider();
    return signInWithRedirect(this.auth, provider);
  }

  /**
   * Google login with a redirect to the main page
   */
  handleGoogleSignInRedirect() {
    return getRedirectResult(this.auth)
      .then(result => {
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const user = result.user;
          console.log(credential, token, user);
          this.router.navigate(['/dabubble']);
        }
      })
      .catch(err => {
        const errorCode = err.code;
        const errorMessage = err.message;
        const email = err.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(err);
        console.warn(errorCode, errorMessage, email, credential);
      });
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
   register(email: string, username: string, password: string, avatar: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password).then((response) => {
      updateProfile(response.user, { displayName: username });
      this.saveNewUserInFirestore(email, username, response.user.uid, avatar);
      this.addNewUserToWelcomeChannel(response.user.uid);
      this.currentUserSig.set({
        email: response.user.email!,
        username: response.user.displayName!,
        uid: response.user.uid!
      })
    })
      .catch((err) => {
        console.error('Error register new User', err);
        throw err;
      });
    return from(promise);
  }

  addNewUserToWelcomeChannel(uid: string){
    const channelIndex = this.fireService.channels.findIndex(channel => channel.name.toLowerCase() === 'welcome');
    if (channelIndex !== -1) {
      const channel = new Channel(this.fireService.channels[channelIndex]);
      channel.users.push(uid);
      this.fireService.addChannel(channel);
    }
  }

  async saveNewUserInFirestore(email: string, username: string, uid: string, avatar: string) {
    let newUser = {
      uid: uid,
      username: username,
      email: email,
      createdAt: this.getCurrentTimestamp(),
      currentlyLoggedIn: true,
      avatar: avatar,
      status: 'online'
    }
    await this.fireService.addUser(newUser);
  }

  getCurrentTimestamp() {
    const now = new Date();
    return now.getTime();
  }

  /**
   * Call this method for updating the username
   * @param newName new username
   */
  updateUsername(newName: string) {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      updateProfile(currentUser, {displayName: newName}).then(()=>{
        this.currentUserSig.set({
          username: newName,
          email: currentUser.email!,
          uid: currentUser.uid
        })
      }).catch((err)=>{
        console.log('Error updating Username', err);
      }) 
    }
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
        user.status = loggedInState ? 'online' : 'offline';
        this.fireService.addUser(user);
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
      this.guestUser = false;
      this.googleUser = false;
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
    this.guestUser = true;
  }

  /**
   * call this method to sign up guest
   * only once needed
   */
  guestSignUp() {
    const guestEmail = 'guest@gmail.com';
    const guestPw = '123456';
    const userName = 'Guest';
    const guestAvatar = './assets/img/chars/profile_placeholder.png';

    this.register(guestEmail, userName, guestPw, guestAvatar);
  }

  /**
   * this method deletes the currently logged in user account.
   * then it deletes the user in firestore
   */
  deleteUserAccount() {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      deleteUser(currentUser).then(() => {
        console.log('User deleted', currentUser);
        this.deleteUserInFirestore(currentUser.uid);
      }).catch((err) => {
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
  deleteUserInFirestore(uid: string) {
    this.fireService.users.forEach((user) => {
      if (uid === user.uid) {
        this.fireService.deleteDocument(user.uid, 'users');
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
  updateUserEmail(newEmail: string) {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      updateEmail(currentUser, newEmail).then(() => {
        this.uiService.toggleProfileChangeConfirmationPopup();
        this.fireService.users.forEach((user) => {
          if (currentUser.uid === user.uid) {
            user.email = newEmail;
            this.fireService.addUser(user);
          }
        })
      }).catch((err) => {
        let code = AuthErrorCodes.EMAIL_CHANGE_NEEDS_VERIFICATION;
        if (code) {
          this.loginTooLongAgo = true;
          this.uiService.toggleVerifyPassword();
        }
        console.log(err);

      });
    }
  }

  /**
   * This method sends a Email to the current User
   * If the user clicks on the link in it, his email is verified
   */
  verifyUsersEmail() {
    if (this.auth.currentUser) {
      sendEmailVerification(this.auth.currentUser).then(() => {
        console.log('email sent!');
      }).catch((err) => {
        console.warn('Error sending Email', err);
      })
    }
  }

  /**
   * This method is for reauthenticate the user
   */
  reAuthenticateUser(email: string, password: string) {
    const credential = EmailAuthProvider.credential(email, password);
    if (this.auth.currentUser) {
      reauthenticateWithCredential(this.auth.currentUser, credential).then(() => {
        console.log('User reauthenticated', email, password, credential);
        if (this.updateEmail) {
          this.updateUserEmail(this.newEmailAddress);
        }
      }).catch((err) => {
        console.warn('Error', err)
      });
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
        let code = AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN // evtl schon vorher abfragen um fehler zu vermeiden!!
        if (code) {
          console.log('Login again before change password');
          // add popup to reAuthentcateUser();
        }
        console.warn('Error updating Password', err);
      })
    }
  }


  /**
 * Sends an email to the user to reset the password
 * @param {string} email
 */
  sendPasswordResetMail(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log('Password reset email sent!')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error('Error Code:', errorCode);
        console.error('Error Message:', errorMessage);
      });
  }

  /**
 * Confirm the password reset with a token called oobCode
 * @param {string} newPassword
 * @param {string} oobCode
 */
  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    try {
      await confirmPasswordReset(this.auth, oobCode, newPassword);
      console.log('Password has been reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  /**
 * Verifies the passwordresetcode 
 * @param {string} oobCode
 */
  async verifyPasswordResetCode(oobCode: string): Promise<void> {
    try {
      await verifyPasswordResetCode(this.auth, oobCode);
    } catch (error) {
      console.error('Error verifying password reset code:', error);
      throw error;
    }
  }


}


