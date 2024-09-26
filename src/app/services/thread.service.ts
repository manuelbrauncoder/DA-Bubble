/**
 * This services handles a few thread methods
 */

import { ElementRef, inject, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  fireService = inject(FirestoreService);

  scrolledToBottomOnStart = false;

  constructor() { }

  scrollAtStart(container: ElementRef) {
    if (this.fireService.currentChannel.messages.length > 0 && !this.scrolledToBottomOnStart) {
      this.scrollToBottom(container);
      this.scrolledToBottomOnStart = true;
    }
  }

  scrollToBottom(container: ElementRef): void {
    try {
      container.nativeElement.scroll({
        top: container.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    } catch (error) {
    }
  }
}
