import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductModule } from './product/product.module';
import { ProductService } from './product/shared/product.service';

const routes: Routes = [
  {path: '', redirectTo: 'products', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ProductModule
  ],
  providers: [
    ProductService
 ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
