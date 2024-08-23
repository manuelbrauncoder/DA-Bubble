import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-for-usermanagement',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header-for-usermanagement.component.html',
  styleUrl: './header-for-usermanagement.component.scss'
})
export class HeaderForUsermanagementComponent {
  showHeaderLink: boolean = false;

  private headerRoute: string[] = ['/login'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeaderLink = this.headerRoute.includes(event.urlAfterRedirects);
      }
    });
  }
}
