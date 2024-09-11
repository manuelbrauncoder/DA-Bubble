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
      this.resetSearch();
      const trimmedInput = this.searchInput.trim().toLowerCase();
      if (trimmedInput.startsWith('#')) {
        this.filteredResults = this.fireService.channels
          .filter(channel => channel.name.toLowerCase().includes(trimmedInput.substring(1)))
          .map(channel => channel.name);
      } else if (trimmedInput.startsWith('@')) {
        this.filteredResults = this.fireService.users
          .filter(user => user.username.toLowerCase().includes(trimmedInput.substring(1)) || user.email.toLowerCase().includes(trimmedInput.substring(1)))
          .map(user => user.username);
      } else {
        const filteredUser = this.fireService.users
          .filter(user => user.username.toLowerCase().includes(trimmedInput) || user.email.toLowerCase().includes(trimmedInput))
          .map(user => user.username)
        const filteredChannels = this.fireService.channels
          .filter(channel => channel.name.toLowerCase().includes(trimmedInput))
          .map(channel => channel.name);
        this.filteredResults = [...new Set([...filteredUser, ...filteredChannels])]
      }
    } else {
      this.resetSearch();
    }
  }

  resetSearch() {
    this.filteredResults = [];
    this.placeholderForChild = 'Starte eine neue Nachricht';
  }

  completeInput(result: string) {
    this.searchInput = result;
    this.filteredResults = [];
    this.createNewPlaceholder(result);
  }

  createNewPlaceholder(name: string) {
    this.placeholderForChild = `Nachricht an ${name}`;
  }

}
