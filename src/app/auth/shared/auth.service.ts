import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from "angularx-social-login";

const jwt = new JwtHelperService();

class DecodedToken {
  userId: string = '';
  username: string = '';
  exp: number = 0; // 有効期限
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private decodedToken: DecodedToken;

  constructor(private http: HttpClient, private router: Router, private socialAuthService: SocialAuthService) {
    this.decodedToken = JSON.parse(localStorage.getItem('app-meta'));
   }

   getToken() {
     return localStorage.getItem('app-auth');
   }

   isAuthenticated(): boolean {
     // 有効期限から過去ならtrue
     if (this.decodedToken != null) {
      return moment().isBefore(moment.unix(this.decodedToken.exp));
     } else {
       return false;
     }
   }

  register(userData: any): Observable<any> {
    return this.http.post('/api/v1/users/register', userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post('/api/v1/users/login', userData)
      .pipe(
        map((token: string) => {
          this.decodedToken = jwt.decodeToken(token);
          localStorage.setItem('app-auth', token);
          localStorage.setItem('app-meta', JSON.stringify(this.decodedToken));

          return token;
        })
      );
  }

  googleLogin(userData: any): Observable<any> {
    return this.http.post('/api/v1/users/googleLogin', userData)
      .pipe(
        map((token: string) => {
          this.decodedToken = jwt.decodeToken(token);
          localStorage.setItem('app-auth', token);
          localStorage.setItem('app-meta', JSON.stringify(this.decodedToken));

          return token;
        })
      );
  }

  logout() {
    this.signOut();
    localStorage.removeItem('app-auth');
    localStorage.removeItem('app-meta');
    localStorage.clear();
    this.decodedToken = new DecodedToken();
  }

  
  signOut(): void {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.signOut();
  }
}
