import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'da-bubble';

  authService = inject(FirebaseAuthService);

  ngOnInit(): void {
    this.subLoginState();
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
}
