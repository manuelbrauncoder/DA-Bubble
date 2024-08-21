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
  showAddChannelPopup: boolean = false;
  showEditUserAndLogoutPopup: boolean = false;
  showViewProfilePopup: boolean = false;
  showEditProfilePopup: boolean = false;
  showVerifyPasswordPopup: boolean = false;


  toggleAddChannelPopup(){
    this.showAddChannelPopup = !this.showAddChannelPopup;
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
  }

  toggleViewProfile() {
    this.showViewProfilePopup = !this.showViewProfilePopup;
  }

  toggleEditProfile() {
    this.showEditProfilePopup = !this.showEditProfilePopup;
  }

  toggleVerifyPassword() {
    this.showVerifyPasswordPopup = !this.showVerifyPasswordPopup;
  }

  constructor() { }
}
