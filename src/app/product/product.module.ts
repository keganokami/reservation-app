import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ProductComponent } from './product.component';
import { AuthGuard } from '../auth/shared/auth.guard';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'products', component: ProductComponent,
    children: [
      { path: '', component: ProductListComponent},
      
    ],
  },
  {path: 'products/:productId', component: ProductDetailComponent}, // authGuardのインポートがされる
];

@NgModule({
   declarations: [
     ProductComponent,
     ProductDetailComponent,
     ProductListComponent,
   ],
   imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MatSliderModule,
   ],
   providers: [ DatePipe ],
   bootstrap: []
})
export class ProductModule { }
