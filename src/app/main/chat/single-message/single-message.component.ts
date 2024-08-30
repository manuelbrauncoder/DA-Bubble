import { Component, inject, Input, OnInit } from '@angular/core';
import { Message } from '../../../models/message.class';
import { UiService } from '../../../services/ui.service';
import { FirestoreService } from '../../../services/firestore.service';
import { Thread } from '../../../models/thread.class ';

@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent implements OnInit {
  uiService = inject(UiService);
  fireService = inject(FirestoreService);
  @Input() currentMessage: Message = new Message();
  @Input() threadMessage: boolean = false;

  ngOnInit(): void {
    this.currentMessage = new Message(this.currentMessage);
  }

  answer(){
    this.uiService.showThread = true;
    this.setCurrentThread();
    this.fireService.currentMessage = new Message(this.currentMessage);
    console.log(this.fireService.currentThread);
    
  }

  setCurrentThread(){
    if (this.currentMessage.thread) {
      this.fireService.currentThread = this.currentMessage.thread;
    }
    this.fireService.currentThread = this.createThread();
    this.currentMessage.thread = this.fireService.currentThread;
  }

  createThread(): Thread{
    return new Thread({
      id: '',
      rootMessage: new Message(this.currentMessage),
      messages: []
    })
  }
}
