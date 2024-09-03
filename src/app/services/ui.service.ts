/**
 * This Service File is for opening and closing UI Elements
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  showWorkspaceMenu: boolean = true; // workspace menu in main-content
  showDirectMessages: boolean = false; // user list in workspace menu
  showChannels: boolean = true; // channel list in workspace menu

  showChannelEditPopup: boolean = false; // opens in channel-chat-component
  showAddUserToChannelPopup: boolean = false;
  showChannelUsersPopup: boolean = false;
  showChannelUsersAddUser: boolean = false;
  showChannelUsers: boolean = true;

  mainContent: 'channelChat' | 'newMessage' | 'directMessage' = 'channelChat';

  showChat: boolean = true; // chat window in main-content
  showThread: boolean = false; // thread window in main-content
  showAddChannelPopup: boolean = false; // add new channel popup
  showAddChannelInlinePopup1: boolean = true; // name and description
  showAddChannelInlinePopup2: boolean = false;  // users
  channelPopup2Searchbar: boolean = false // search users for channel

  showEditUserAndLogoutPopup: boolean = false;
  showViewProfilePopup: boolean = false;
  showEditProfilePopup: boolean = false;
  showVerifyPasswordPopup: boolean = false;
  showChangeAvatarContainer: boolean = false;
  showProfileChangeConfirmationPopup: boolean = false;

  closeThreadWindow() {
    this.showThread = false;
  }

  changeMainContent(content: 'channelChat' | 'newMessage' | 'directMessage'){
    this.mainContent = content;
  }

  showAddUserInChannelUser(){
    this.showChannelUsersAddUser = true;
    this.showChannelUsers = false;
  }

  toggleChannelUsersPopup(){
    this.showChannelUsersPopup = !this.showChannelUsersPopup;
    this.showChannelUsersAddUser = false;
    this.showChannelUsers = true;
  }

  toggleAddUserToChannelPopup(){
    if (this.showChannelUsersAddUser) {
      this.toggleChannelUsersPopup();
    } else {
      this.showAddUserToChannelPopup = !this.showAddUserToChannelPopup;
    }
  }

  toggleEditChannelPopup(){
    this.showChannelEditPopup = !this.showChannelEditPopup;
  }

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

  /**
   * Toggles the visibility of the popup for editing the user profile and logging out.
   * Resets other related popups to their hidden state.
   */

  toggleEditUserAndLogoutPopup() {
    this.showEditUserAndLogoutPopup = !this.showEditUserAndLogoutPopup;
    this.showViewProfilePopup = false;
    this.showEditProfilePopup = false;
    this.showVerifyPasswordPopup = false;
    this.showChangeAvatarContainer = false;
  }

  /**
   * Toggles the visibility of the popup for viewing the user profile.
   */
  toggleViewProfile() {
    this.showViewProfilePopup = !this.showViewProfilePopup;
  }

  /**
   * Toggles the visibility of the popup for editing the user profile.
   */
  toggleEditProfile() {
    this.showEditProfilePopup = !this.showEditProfilePopup;
  }

  /**
   * Toggles the visibility of the container for changing the user's avatar.
   */
  toggleChangeAvatarContainer() {
    this.showChangeAvatarContainer = !this.showChangeAvatarContainer;
  }

  /**
   * Toggles the visibility of the popup for verifying the user's password.
   */
  toggleVerifyPassword() {
    this.showVerifyPasswordPopup = !this.showVerifyPasswordPopup;
  }

  /**
   * Toggles the visibility of the confirmation popup for profile changes.
   * The variable "showProfileChangeConfirmationPopup" will automatically set to false after 4.5 seconds.
   */
  toggleProfileChangeConfirmationPopup() {
    this.showProfileChangeConfirmationPopup = !this.showProfileChangeConfirmationPopup;
    
    setTimeout(() => {
      this.showProfileChangeConfirmationPopup = false;
    }, 4500);
  }

  constructor() { }
}
