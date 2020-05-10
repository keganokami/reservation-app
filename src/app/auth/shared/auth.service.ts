import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {
    this.decodedToken = JSON.parse(localStorage.getItem('app-meta'));
   }

   getToken() {
     return localStorage.getItem('app-auth');
   }

   isAuthenticated() {
     // 有効期限から過去ならtrue
     if (this.decodedToken != null) {
      return moment().isBefore(moment.unix(this.decodedToken.exp));
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

  logout() {
    localStorage.removeItem('app-auth');
    localStorage.removeItem('app-meta');
    this.decodedToken = new DecodedToken();
    this.router.navigate(['/login']);
  }
}