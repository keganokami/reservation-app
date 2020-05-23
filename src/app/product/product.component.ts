import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Products, ProductService } from './shared/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  isLoadingData: boolean;
  products: Products;
  @Input() isProductSelected;

  constructor(private productService: ProductService) { }

  ngOnInit() {
      this.isLoadingData = true;
      this.productService.getProducts().subscribe(
        (data) => this.products = data,
        (err) => console.log(err),
      );
  }
}
