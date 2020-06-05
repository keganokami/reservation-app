import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Products, ProductService } from '../shared/product.service';
import { SelectPrefectures } from 'src/app/util/prefectures';

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

  coverImage1: string;
  coverImage2: string;
  coverImage3: string;

  @Input() isProductSelected: boolean = false;
  state_default: boolean = true;
  isSameUser: boolean = false;
  isDisabled: boolean = true;
  createDate: Date;
  userId: string = null;
  prefectures = SelectPrefectures;
  selectedPrefecture;
  /* localStrageに保存しているトークン */
  tokenData: string = localStorage.getItem('app-meta');

  isPosting: boolean = false;

  myUrl: string;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
  ) {
    const dataObj: Tokens = JSON.parse(this.tokenData);
    this.userId = dataObj.userId;
    this.myUrl = location.href;
    console.log(this.myUrl);
  }

  product: Products;

  onButtonClickeEditableChenage() {
    this.isDisabled = !this.isDisabled;
  }

  ngOnInit() {
    this.getData();
  }

  getSelectedPref(event: any) {
    this.selectedPrefecture = event;
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
    const forms: Products = updateData.value;
    forms.createDate = new Date();
    if (this.isDisabled) {
      this.isPosting = true;
      console.log(updateData);
      this.productService.updateOne(updateData.value).subscribe(
        (data) => {
          console.log('updated');
        }
      );
      await this.getData();
      location.reload();
    }
  }

  onButtonClickRemovePost(product: Products) {
    const isRemoveOk = window.confirm('本当に削除しますか？');
    if (!isRemoveOk) {
      return;
    }
    this.removePost(product);
    this.router.navigate(['/products']);

  }

  removePost(product: Products) {
    const id = product._id;
    this.productService.removeOne(id).subscribe(
      (result) => {
        this.router.navigate(['/products']);
      },
      (err) => {
      }
    );
  }
}
