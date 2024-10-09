import { Component, inject, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.class';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-popup-view-other-users-profile',
  standalone: true,
  imports: [],
  templateUrl: './popup-view-other-users-profile.component.html',
  styleUrl: './popup-view-other-users-profile.component.scss'
})
export class PopupViewOtherUsersProfileComponent implements OnInit {
  userService = inject(UserService);
  uiService = inject(UiService);
  user: User | null = null;

  ngOnInit(): void {
    this.user = this.userService.getUserData(this.userService.uidForProfile);
  }

  closeOtherUsersProfile() {
    this.uiService.toggleOtherUsersProfile();
  }
}