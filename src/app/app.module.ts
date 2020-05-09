import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { NavbarComponent } from './common/navbar/navbar.component';
import { DecimalPipe } from '@angular/common';


@NgModule({
   declarations: [
      AppComponent,
      NavbarComponent,
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      AppRoutingModule,
      AuthModule
   ],
   providers: [ DecimalPipe ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
