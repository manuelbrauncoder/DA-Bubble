import { animate, style, transition, trigger } from '@angular/animations';
const popupHidden = { opacity: '0'};
const popupVisible = { opacity: '1'};
const timing = '225ms ease-in';

export const fadeIn = trigger('fadeIn', [
    transition(':enter', [style(popupHidden), animate(timing, style(popupVisible))]),
    transition(':leave', [style(popupVisible), animate(timing, style(popupHidden))]),
  ])