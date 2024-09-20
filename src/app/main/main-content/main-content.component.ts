import { Component, inject } from '@angular/core';
import { WorkspaceMenuComponent } from "../workspace-menu/workspace-menu.component";
import { WorkspaceMenuButtonComponent } from "../workspace-menu-button/workspace-menu-button.component";
import { UiService } from '../../services/ui.service';
import { ChatComponent } from "../chat/chat.component";
import { ThreadComponent } from '../thread/thread.component';
import { AddChannelPopupComponent } from '../add-channel-popup/add-channel-popup.component';

import { fadeIn, toggleWorkspace, toggleThread, expandChat } from '../../shared/animations';
import { BreakpointObserverService } from '../../services/breakpoint-observer.service';



@Component({
  selector: 'app-main-content',
  animations: [fadeIn, toggleWorkspace, toggleThread, expandChat],
  standalone: true,
  imports: [WorkspaceMenuComponent, WorkspaceMenuButtonComponent, ChatComponent, ThreadComponent, AddChannelPopupComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  uiService = inject(UiService);
  observerService = inject(BreakpointObserverService);

}
