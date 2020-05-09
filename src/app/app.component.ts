import { DOCUMENT, Location } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './common/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(NavbarComponent, { static: false }) navbar: NavbarComponent;
  private _router: Subscription;
  // tslint:disable-next-line: max-line-length
  constructor(private renderer: Renderer2, private router: Router, @Inject(DOCUMENT) private document: any, private element: ElementRef, public location: Location) { }
  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
    this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if (window.outerWidth > 991) {
        window.document.children[0].scrollTop = 0;
      } else {
        window.document.activeElement.scrollTop = 0;
      }
      this.navbar.sidebarClose();
    });
    this.renderer.listen('window', 'scroll', (event) => {
      const sNum = window.scrollY;
      if (sNum > 150 || window.pageYOffset > 150) {
        // add logic
        navbar.classList.remove('navbar-transparent');
      } else {
        // remove logic
        navbar.classList.add('navbar-transparent');
      }
    });
    const ua = window.navigator.userAgent;
    const trident: number = ua.indexOf('Trident/');
    let version: number;
    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf('rv:');
      version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    if (version) {
      const body = document.getElementsByTagName('body')[0];
      body.classList.add('ie-background');
    }

  }
  removeFooter() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);
    if (titlee === 'signup' || titlee === 'nucleoicons') {
      return false;
    } else {
      return true;
    }
  }
}
