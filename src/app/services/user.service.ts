import { inject, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { FirebaseAuthService } from './firebase-auth.service';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  fireService = inject(FirestoreService)
  authService = inject(FirebaseAuthService);

  constructor() { }

 

  /**
   * Call this method to delete all data in 'users'
   * then push example users to 'users' collection in firebase
   */
  async resetUsersInFirebase(){
    if (confirm('Delete all Users, and replace with example Users?')) {
      await this.deleteAllUsers();
      await this.addExampleUsersToFirebase();
    }
  }

  async addExampleUsersToFirebase(){
    for (let i = 0; i < this.fireService.exampleUsers.length; i++) {
      const user = this.fireService.exampleUsers[i];
      await this.fireService.addUser(user);
    }
  }

  async deleteAllUsers(){
    while (this.fireService.users.length > 0) {
      const id = this.fireService.users[0].id;
      await this.fireService.deleteDocument(id, 'users');
    }
  }
}
