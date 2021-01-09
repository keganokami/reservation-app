import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { NavbarComponent } from './common/navbar/navbar.component';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';



@NgModule({
   declarations: [
      AppComponent,
      NavbarComponent,
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      AppRoutingModule,
      AuthModule,
      SocialLoginModule
   ],
   providers: [DecimalPipe,
      {
         provide: 'SocialAuthServiceConfig',
         useValue: {
            autoLogin: false,
            providers: [
               {
                  id: GoogleLoginProvider.PROVIDER_ID,
                  provider: new GoogleLoginProvider(
                     '191460419386-qfshn7ossub6mg308j6bnru60mdjd7ph.apps.googleusercontent.com'
                  )
               },
               {
                  id: FacebookLoginProvider.PROVIDER_ID,
                  provider: new FacebookLoginProvider('clientId')
               }
            ]
         } as SocialAuthServiceConfig,
      }],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
