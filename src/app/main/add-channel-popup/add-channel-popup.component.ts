import { Component, inject } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Channel } from '../../models/channel.class';
import { ChannelService } from '../../services/channel.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
  selector: 'app-add-channel-popup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-channel-popup.component.html',
  styleUrl: './add-channel-popup.component.scss'
})
export class AddChannelPopupComponent {
  uiService = inject(UiService);
  channelService = inject(ChannelService);
  authService = inject(FirebaseAuthService);
  newChannel: Channel = new Channel;

  /**
   * When form is valide and submitted,
   * this method adds the new channel to firebase
   * set current user as creator
   * @param ngForm 
   */
  async onSubmit(ngForm: NgForm){
    if (ngForm.valid && ngForm.submitted) {
      this.newChannel.creator = this.addCurrentUserAsChannelCreator();
      await this.channelService.fireService.addChannel(this.newChannel);
      this.channelService.toggleActiveChannel(this.newChannel);
      this.uiService.toggleAddChannelPopup();
    }    
  }

  /**
   * add current user as channel creator to newChannel
   * @returns current user name
   */
  addCurrentUserAsChannelCreator(){
    if (this.authService.auth.currentUser?.displayName) {
      return this.authService.auth.currentUser?.displayName;
    } else {
      return '';
    }
  }

}
