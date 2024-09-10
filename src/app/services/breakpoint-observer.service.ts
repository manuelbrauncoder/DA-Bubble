import { inject, Injectable, DestroyRef } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
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
    `(min-width: 1100px)`
  ];

  isMobile: boolean = false;
  isTablet : boolean = false;
  isHandsetLandscape: boolean = false;


  constructor(private responsive: BreakpointObserver, private destroyRef: DestroyRef) { }

  initObserver(){
    this.responsive.observe(this.breakpointsToObserve)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(state => {
      if (state.breakpoints[`(max-width: 1399px)`]) {
        // tablet
        console.log('Tablet');
        this.uiService.showWorkspaceMenu = false;
        this.isTablet = true;
        this.isMobile = false;
        this.uiService.showChat = true;
      }
      if (state.breakpoints[`(max-width: 999px)`]) {
        // mobile
        console.log('Mobile');
        this.isMobile = true;
        this.isTablet = false;
        this.hideInMobile();
      }
      if (state.breakpoints[`(min-width: 1400px)`]) {
        // desktop
        console.log('Desktop');
        this.isMobile = false;
        this.isTablet = false;
        this.showInDesktop();
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
