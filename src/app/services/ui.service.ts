/**
 * This Service File is for opening and closing UI Elements
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  showWorkspaceMenu: boolean = true;
  showDirectMessages: boolean = false;
  showChannels: boolean = true;
  showThread: boolean = true;
  showAddChannelPopup: boolean = false; // add new channel popup
  showAddChannelInlinePopup1: boolean = true; // name and description
  showAddChannelInlinePopup2: boolean = false;  // users
  channelPopup2Searchbar: boolean = false // search users for channel
  showEditUserAndLogoutPopup: boolean = false;
  showViewProfilePopup: boolean = false;
  showEditProfilePopup: boolean = false;
  showChangeAvatarPopup: boolean = false;
  showVerifyPasswordPopup: boolean = false;

  /**
   * Close Popup for adding Channel Name and Description
   * Open Popup for adding Users to Channel
   */
  openAddChannelPopup2(){
    this.showAddChannelInlinePopup2 = !this.showAddChannelInlinePopup2;
    this.showAddChannelInlinePopup1 = !this.showAddChannelInlinePopup1;
  }


  toggleAddChannelPopup(){
    this.showAddChannelPopup = !this.showAddChannelPopup;
    this.showAddChannelInlinePopup2 = false;
    this.showAddChannelInlinePopup1 = true;
  }

  toggleWorkspaceMenu(){
    this.showWorkspaceMenu = !this.showWorkspaceMenu;
  }

  toggleDirectMessages(){
    this.showDirectMessages = !this.showDirectMessages;
  }

  toggleChannels(){
    this.showChannels = !this.showChannels;
  }

  toggleEditUserAndLogoutPopup() {
    this.showEditUserAndLogoutPopup = !this.showEditUserAndLogoutPopup;
    this.showViewProfilePopup = false;
    this.showEditProfilePopup = false;
    this.showVerifyPasswordPopup = false;
  }

  toggleViewProfile() {
    this.showViewProfilePopup = !this.showViewProfilePopup;
  }

  toggleEditProfile() {
    this.showEditProfilePopup = !this.showEditProfilePopup;
  }

  toggleChangeAvatar() {
    this.showChangeAvatarPopup = !this.showChangeAvatarPopup;
  }

  toggleVerifyPassword() {
    this.showVerifyPasswordPopup = !this.showVerifyPasswordPopup;
  }

  constructor() { }
}
