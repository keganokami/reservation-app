import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { products } from '../../products';
import { ProductService, Products } from '../shared/product.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
    ) { }

  product: Products;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const productObservablue = this.productService.getProductById(params.get('productId'));
      productObservablue.subscribe((data) => {
        this.product = data;
      },
      (error) => {

      });
    });
  }
}
