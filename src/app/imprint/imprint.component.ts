import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent {
  location = inject(Location);

  /**
   * Navigates back to the previous page in the browser history.
   */
  goBack() {
    this.location.back();
  }
}