import { Component } from '@angular/core';
import { WorkspaceMenuComponent } from "../workspace-menu/workspace-menu.component";
import { WorkspaceMenuButtonComponent } from "../workspace-menu-button/workspace-menu-button.component";

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [WorkspaceMenuComponent, WorkspaceMenuButtonComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  showWorkspaceMenu = true;

}
