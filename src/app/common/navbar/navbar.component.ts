import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { SocialUser } from "angularx-social-login";
import { AuthService } from 'src/app/auth/shared/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private toggleButton: any;
  private sidebarVisible: boolean;
  user: SocialUser;

  constructor(public location: Location, private element: ElementRef, public auth: AuthService) {
      this.sidebarVisible = false;
  }

  ngOnInit() {
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
  }
  sidebarOpen() {
      const toggleButton = this.toggleButton;
      const html = document.getElementsByTagName('html')[0];

      setTimeout(() => {
          toggleButton.classList.add('toggled');
      }, 500);
      html.classList.add('nav-open');

      this.sidebarVisible = true;
  }
  sidebarClose() {
      const html = document.getElementsByTagName('html')[0];
      this.toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      html.classList.remove('nav-open');
  }
  sidebarToggle() {
      // const toggleButton = this.toggleButton;
      // const body = document.getElementsByTagName('body')[0];
      if (this.sidebarVisible === false) {
          this.sidebarOpen();
      } else {
          this.sidebarClose();
      }
  }

  logout() {
    this.auth.logout();
  }
}


