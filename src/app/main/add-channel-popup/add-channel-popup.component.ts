import { Component, inject } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Channel } from '../../models/channel.class';
import { ChannelService } from '../../services/channel.service';

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
  newChannel: Channel = new Channel;

  async onSubmit(ngForm: NgForm){
    if (ngForm.valid && ngForm.submitted) {
      await this.channelService.fireService.addChannel(this.newChannel);
      this.channelService.toggleActiveChannel(this.newChannel);
      this.uiService.toggleAddChannelPopup();
    }    
  }

}
