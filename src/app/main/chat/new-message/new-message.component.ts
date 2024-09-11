import { Component, inject } from '@angular/core';
import { SendMessageComponent } from "../send-message/send-message.component";
import { FirestoreService } from '../../../services/firestore.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.class';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [SendMessageComponent, FormsModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  fireService = inject(FirestoreService);

  searchInput = '';
  filteredUsers: string[] = [];

  search() {
    if (this.searchInput.trim()) {
      this.filteredUsers = [];
      let trimmedInput = this.searchInput.trim().toLowerCase();
      let filteredUser = this.fireService.users.filter(user =>
        this.searchUser(user, trimmedInput)
      );
      this.filteredUsers = filteredUser.map(user => user.username);
    } else {
      this.filteredUsers = [];
    }
  }

  completeUser(username: string){
    this.searchInput = username;
    this.filteredUsers = [];
  }

  searchUser(user: User, input: string) {
    return user.username.toLowerCase().includes(input) || user.email.toLowerCase().includes(input);
  }

}
