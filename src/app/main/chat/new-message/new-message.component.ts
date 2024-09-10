import { Component } from '@angular/core';
import { SendMessageComponent } from "../send-message/send-message.component";

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [SendMessageComponent],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {

}
