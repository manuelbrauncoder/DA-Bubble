import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-send-mail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-mail.component.html',
  styleUrl: './send-mail.component.scss'
})
export class SendMailComponent {


  email: string = '';

  sendMail() {

  }
}
