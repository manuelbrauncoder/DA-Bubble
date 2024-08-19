/**
 * This Service File is for opening and closing UI Elements
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  showWorkspaceMenu = true;
  showDirectMessages = true;
  showChannels: boolean = true;
  showEditUserAndLogoutPopup: boolean = false;
  showViewProfilePopup: boolean = false;


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
  }

  toggleViewProfile() {
    this.showViewProfilePopup = !this.showViewProfilePopup;
  }

  constructor() { }
}
