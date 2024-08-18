import { Component } from '@angular/core';
import { WorkspaceMenuComponent } from "../workspace-menu/workspace-menu.component";

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [WorkspaceMenuComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
