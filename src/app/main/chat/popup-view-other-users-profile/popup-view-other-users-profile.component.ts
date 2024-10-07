import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-popup-view-other-users-profile',
  standalone: true,
  imports: [],
  templateUrl: './popup-view-other-users-profile.component.html',
  styleUrl: './popup-view-other-users-profile.component.scss'
})
export class PopupViewOtherUsersProfileComponent {
  @Input()otherUsersProfile: any;
}