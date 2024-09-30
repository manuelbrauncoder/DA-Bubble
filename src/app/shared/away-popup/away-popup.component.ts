import { Component } from '@angular/core';

@Component({
  selector: 'app-away-popup',
  standalone: true,
  imports: [],
  templateUrl: './away-popup.component.html',
  styleUrl: './away-popup.component.scss'
})
export class AwayPopupComponent {
  countdown = 5;

  startCountdown(){
    setInterval(() => {
      this.countdown--;
    }, 60000);
  }

  constructor(){
    this.countdown = 5;
    this.startCountdown();
  }
}
