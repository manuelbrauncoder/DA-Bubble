import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { HeaderComponent } from './shared/header/header.component';
import { FirestoreService } from './services/firestore.service';
import { UserInterface } from './interfaces/user-interface';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'da-bubble';

  authService = inject(FirebaseAuthService);
  fireService = inject(FirestoreService);
  userService = inject(UserService);

  unsubUsersList;

  constructor() {
    this.unsubUsersList = this.fireService.getUsersList();
  }

  ngOnInit(): void {
    this.subLoginState();
    this.subExampleUsers();
    //this.logAfter500Ms() // just for testing
  }

  ngOnDestroy(): void {
    this.unsubUsersList();
  }

  /**
   * Subscribes to the login state of the user and updates the current user information.
   * 
   * This function listens to changes in the authentication state by subscribing to the `user$` observable.
   * If a user is logged in, it updates the `currentUserSig` signal with the user's email and display name.
   * If no user is logged in, it sets `currentUserSig` to `null`.
   * display username in html: {{ authService.currentUserSig()?.username }}
   */
  subLoginState() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!
        })
      } else {
        this.authService.currentUserSig.set(null);
      }
      console.log('currently logged in user:', this.authService.currentUserSig());
    })
  }

  /**
   * uses http client to get data form assets/data/exampleUsers.json
   */
  subExampleUsers() {
    this.fireService.fetchExampleUsers().subscribe((data: UserInterface[])=> {
      this.fireService.exampleUsers = data;
    })
  }

  /**
   * Just for Testing
   */
  logAfter500Ms(){
    setTimeout(() => {
      //this.userService.resetUsersInFirebase();
      console.log('users:', this.fireService.users);
      console.log('example data, fetched local', this.fireService.exampleUsers); 
    }, 5000);
  }
}
