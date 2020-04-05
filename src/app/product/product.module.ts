import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';


const routes: Routes = [
  {
    path: 'products', component: ProductComponent,
    children: [
      {path: '', component: ProductListComponent},
      {path: ':productId', component: ProductDetailComponent},
    ]
  },


];

@NgModule({
   declarations: [
     ProductComponent,
     ProductDetailComponent,
     ProductListComponent,

   ],
   imports: [
    RouterModule.forChild(routes),
    CommonModule
   ],
   providers: [],
   bootstrap: []
})
export class ProductModule { }
