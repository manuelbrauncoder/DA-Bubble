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
  filteredResults: string[] = [];

  placeholderForChild = 'Starte eine neue Nachricht';

  search() {
    if (this.searchInput.trim()) {
      this.filteredResults = [];
      const trimmedInput = this.searchInput.trim().toLowerCase();
      const filteredUser = this.fireService.users
        .filter(user => this.searchUser(user, trimmedInput))
        .map(user => user.username)
      const filteredChannels = this.fireService.channels
        .filter(channel => channel.name.toLowerCase().includes(trimmedInput))
        .map(channel => channel.name);
      this.filteredResults = [...new Set([...filteredUser, ...filteredChannels])]
    } else {
      this.filteredResults = [];
      this.placeholderForChild = 'Starte eine neue Nachricht';
    }
  }

  completeInput(result: string){
    this.searchInput = result;
    this.filteredResults = [];
    this.createNewPlaceholder(result);
  }

  createNewPlaceholder(name: string){
    this.placeholderForChild = `Nachricht an ${name}`;
  }

  searchUser(user: User, input: string) {
    return user.username.toLowerCase().includes(input) || user.email.toLowerCase().includes(input);
  }

}
