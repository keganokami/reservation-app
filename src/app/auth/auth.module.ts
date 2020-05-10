import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './shared/auth.service';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './shared/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/token.interceptor';
import { ProductPostComponent } from '../product/pruoduct-post/pruoduct-post.component';


const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'post', component: ProductPostComponent, canActivate: [AuthGuard]},
];

@NgModule({
   declarations: [
    LoginComponent,
    RegisterComponent,
    ProductPostComponent
   ],
   imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
   ],
   providers: [
     AuthService,
     AuthGuard,
     {
       provide: HTTP_INTERCEPTORS,
       useClass: TokenInterceptor,
       multi: true,
     }
   ],
   bootstrap: []
})
export class AuthModule { }
