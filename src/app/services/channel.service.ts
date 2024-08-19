import { inject, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Channel } from '../models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  fireService = inject(FirestoreService);

  constructor() { }


  toggleActiveChannel(activeChannel: Channel) {
    this.fireService.channels.forEach((channel) => {
      if (activeChannel.name === channel.name) {
        channel.channelActive = true;
      } else {
        channel.channelActive = false;
      }
    })
  }
}