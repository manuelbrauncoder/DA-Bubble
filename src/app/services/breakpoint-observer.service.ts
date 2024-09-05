import { inject, Injectable } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {

  uiService = inject(UiService);

  breakpointsToObserve = [Breakpoints.TabletPortrait, Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape];

  isMobile: boolean = false;
  isHandsetLandscape: boolean = false;


  constructor(private responsive: BreakpointObserver) { }

  initObserver(){
    this.responsive.observe(this.breakpointsToObserve).subscribe((result) => {
      if (result.breakpoints[Breakpoints.TabletPortrait] || result.breakpoints[Breakpoints.HandsetPortrait]) {
        this.isMobile = true;
        this.hideInMobilePortrait();       
      } else if (!result.breakpoints[Breakpoints.TabletPortrait] || !result.breakpoints[Breakpoints.HandsetPortrait]) {
        this.isMobile = false;
        this.showInDesktopMode();
      }
      if (result.breakpoints[Breakpoints.HandsetLandscape]) {
        this.isHandsetLandscape = true;
      } else if(!result.breakpoints[Breakpoints.HandsetLandscape]) {
        this.isHandsetLandscape = false;        
      }
    });
  }

  hideInMobilePortrait(){
    this.uiService.showWorkspaceMenu = true;
    this.uiService.showThread = false;
    this.uiService.showChat = false;
  }

  showInDesktopMode(){
    this.uiService.showWorkspaceMenu = true;
    this.uiService.showThread = false;
    this.uiService.showChat = true;
  }
}
