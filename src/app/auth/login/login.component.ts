import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Tokens } from 'src/app/product/product-detail/product-detail.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit {
  errors: any[];
  onLogin: boolean = false;

  /* localStrageに保存しているトークン */
  tokenData: string = localStorage.getItem('app-meta');

  GoogleLoginProvider: GoogleLoginProvider;
  constructor(private authService: AuthService, private router: Router, private socialAuthService: SocialAuthService) {
    this.socialAuthService.authState.subscribe((user) => {
      if (user == null) {
        return;
      }
      if (!this.onLogin && this.tokenData == null) {
        return;
      }
      this.authService.googleLogin(user).subscribe(
        (result) => {
          this.onLogin = false;
          this.router.navigate(['/products']);
          
        },
        (err: HttpErrorResponse) => {
          // console.log(err);
        }
      );
    });
  }

  login(loginForm) {
    if (loginForm == null) {
      return;
    }
    this.authService.login(loginForm.value).subscribe(
      (result) => {
        this.router.navigate(['/products']);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errors = err.error.error;
      }
    );
  }

  ngOnInit() {
    const isLogined = this.authService.isAuthenticated();
    if (isLogined) {
      this.router.navigate(['/products']);
    }
  }

  refreshToken(): void {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);

  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.onLogin = true;
  }

  // signInWithFB(): void {
  //   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }

  signOut(): void {
    this.socialAuthService.signOut();
    this.refreshToken();
  }
}
