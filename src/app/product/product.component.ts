import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Products, ProductService } from './shared/product.service';
import { toUnicode } from 'punycode';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  isLoadingData: boolean;
  products: Products;
  @Input() isProductSelected;
  isPosting: boolean;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.isPosting = true;
    this.isLoadingData = true;
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        setTimeout(() => {
          this.isPosting = false;
        }, 999999);

      },
      (err) => console.log(err),
    );

  }
}
