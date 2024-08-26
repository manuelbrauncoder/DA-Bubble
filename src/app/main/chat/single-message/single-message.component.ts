import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../../models/message.class';

@Component({
  selector: 'app-single-message',
  standalone: true,
  imports: [],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent implements OnInit {
  @Input() currentMessage: Message = new Message();

  ngOnInit(): void {
    this.currentMessage = new Message(this.currentMessage);
  }
}
