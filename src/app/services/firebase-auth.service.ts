/**
 * This service is for handling firebase Authentication
 */

import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  auth = inject(Auth);
  user$ = user(this.auth);
  
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  constructor() { }


/**
 * Registers a new user with Firebase Authentication.
 *
 * This function creates a new user account with the provided email and password.
 * After successfully registering, it updates the user's profile with the provided username (displayName).
 *
 * @param {string} email
 * @param {string} username 
 * @param {string} password 
 * @returns {Observable<void>} An observable that completes when the user is successfully registered and the profile is updated.
 */
  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    ).then((response) =>
      updateProfile(response.user, { displayName: username })
    );
    return from(promise);
  }

 /**
 * Logs in a user with Firebase Authentication.
 *
 * If the login is successful, the function completes without any additional actions.
 * .then ==> calls a empty function, without that, typescript will not be happy :)
 *
 * @param {string} email 
 * @param {string} password 
 * @returns {Observable<void>} An observable that completes when the login process is successful.
 */
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, password).then(()=>{});
    return from(promise);
  }

  /**
   * 
   * @returns an observable that completes when logout is successful.
   */
  logout(): Observable<void> {
    const promise = signOut(this.auth);
    return from(promise);
  }
}
