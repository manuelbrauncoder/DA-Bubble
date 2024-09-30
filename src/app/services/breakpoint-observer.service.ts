/**
 * This Service handles different breakpoints
 */

import { inject, Injectable, DestroyRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UiService } from './ui.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {

  uiService = inject(UiService);

  breakpointsToObserve = [
    `(max-width: 1399px)`,
    `(max-width: 999px)`,
    `(min-width: 1400px)`,
    Breakpoints.HandsetLandscape
  ];

  isMobile: boolean = false;
  isTablet : boolean = false;
  isHandsetLandscape: boolean = false;


  constructor(private responsive: BreakpointObserver, private destroyRef: DestroyRef) { }

  /**
   * initializes the breakpoin observer
   */
  initObserver(){
    this.responsive.observe(this.breakpointsToObserve)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(state => {
      if (state.breakpoints[`(max-width: 1399px)`]) {
        this.isTablet = true;
        this.isMobile = false;
        this.uiService.showChat = true;
      }
      if (state.breakpoints[`(max-width: 999px)`]) {
        this.isMobile = true;
        this.isTablet = false;
        this.hideInMobile();
      }
      if (state.breakpoints[`(min-width: 1400px)`]) {
        this.isMobile = false;
        this.isTablet = false;
        this.showInDesktop();
      }
      if (state.breakpoints[Breakpoints.HandsetLandscape]) {
        this.isHandsetLandscape = true;
        console.log('handsetLandscape');
        
      } else {
        this.isHandsetLandscape = false;
        console.log('no landscape');
        
      }
    })
  }

  hideInMobile(){
    this.uiService.showWorkspaceMenu = true;
    this.uiService.showThread = false;
    this.uiService.showChat = false;
  }

  showInDesktop(){
    this.uiService.showWorkspaceMenu = true;
    this.uiService.showThread = false;
    this.uiService.showChat = true;
  }
}
