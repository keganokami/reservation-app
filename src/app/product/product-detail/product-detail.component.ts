import { Component, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ProductService, Products } from '../shared/product.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

interface Tokens {
  username: string;
  userId: string;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnChanges {
  @Output() titleChanged: EventEmitter<string> = new EventEmitter<string>();
  textareaForm = new FormGroup({
    address: new FormControl()
  });

  state_default: boolean = true;
  isSameUser: boolean = false;
  isDisabled: boolean = true;
  createDate: Date;
  userId: string = null;
  tokenData: string = localStorage.getItem('app-meta');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
  ) {
    const dataObj: Tokens = JSON.parse(this.tokenData);
    this.userId = dataObj.userId;
  }

  product: Products;

  onButtonClickeEditableChenage() {
    this.isDisabled = !this.isDisabled;
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.route.paramMap.subscribe(params => {
      const productObservablue = this.productService.getProductById(params.get('productId'));
      productObservablue.subscribe((data) => {
        this.product = data;
        // ユーザー情報と投稿ユーザーの一致を検知
        this.isSameUser = (this.product.userId === this.userId);
      },
        (error) => {
        });
    });
  }

  ngOnChanges() {

  }

  async updatePost(updateData: any) {
    this.createDate = new Date();
    if (this.isDisabled) {
      console.log(updateData);
      this.productService.updateOne(updateData.value).subscribe(
        (data) => {
          console.log('updated');
          this.router.navigate(['/products/' + this.product._id]);
        }
      );
      await this.getData();
    }
  }
}
