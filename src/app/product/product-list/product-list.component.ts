import { AuthService } from './../../auth/shared/auth.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ProductService, Products } from '../shared/product.service';
import { Router } from '@angular/router';
import { products } from 'src/app/products';

interface Tokens {
  username: string;
  userId: string;
}
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnChanges {

  @Input() products: Products[];
  myProducts: Products[];
  isPrevPage: boolean = false;
  pageNum: number[] = [];
  begin: number = 0;
  length: number = 8;
  pageNumBox: number[]; // pageの配列
  isActivePage: number = 0;　// アクティブなページ
  pageAryCount: number;
  myPageAryCount: number;　// 自分の投稿で絞り込む時
  buttonText: string = '自分の投稿のみを表示';

  isFilterdUSerId: boolean = false;


  tokenData: string = localStorage.getItem('app-meta');
  userId: string;

  constructor(private productService: ProductService, private router: Router, public auth: AuthService) {
    const dataObj: Tokens = JSON.parse(this.tokenData);
    if (dataObj !== null) {
      this.userId = dataObj.userId;
    }
  }
  ngOnChanges(): void {
    if (this.products) {
      this.pageAryCount = Math.ceil(this.products.length / this.length);
      console.log(this.pageAryCount);
      this.createPageArray(5);
    }
  }

  ngOnInit() {
  }

  getAll() {
    this.productService.getProducts().subscribe(
      (data) => this.products = data,
      (err) => console.log(err),
    );
  }

  isShowPrevPageButton() {
    this.isPrevPage = this.begin === 0 ? false : true;
  }

  onButtonClickPager(page: number) {
    // ボタンをクリックした際に現在のページとネクストなどを押したときに起点となるページを入れる
    this.isActivePage = page;
    this.begin = this.length * page;
    this.isShowPrevPageButton();

  }

  createPageArray(maxPage: number) {
    if (maxPage % 5 === 0) {
      for (let i = 0; i < this.pageAryCount; i++) {
        this.pageNum[i] = i + this.isActivePage;
      }
    }
  }

  // 戻るボタンを押した時にページ配列を作り直す
  createPrevPageArray(maxPage: number) {
    if ((maxPage + 1) % 5 === 0) {
      const minPage = this.isActivePage - 4;
      if (minPage < 0) {
        return;
      }
      for (let i = 0; i < 5; i++) {
        this.pageNum[i] = i + minPage;
      }
    }
  }

  goNextPage() {
    this.isActivePage = this.isActivePage + 1;
    this.createPageArray(this.isActivePage);
    this.onButtonClickPager(this.isActivePage);
    this.isShowPrevPageButton();
  }

  goPrevPage() {
    this.isActivePage = this.isActivePage - 1;
    if (this.isActivePage < 0) {
      return;
    }
    this.createPrevPageArray(this.isActivePage);
    this.onButtonClickPager(this.isActivePage);
    this.isShowPrevPageButton();
  }

  // 自分の投稿で絞り込んだ時のページング変更処理
  onClickToggleAllPoststoMyPosts() {
    this.isFilterdUSerId = !this.isFilterdUSerId;
    this.buttonText = this.isFilterdUSerId ? '全件を表示' : '自分の投稿のみを表示';
    this.myProducts = this.products.filter(item => item.userId === this.userId);
    this.myPageAryCount = this.myProducts.length;
    this.pageAryCount = this.isFilterdUSerId ? Math.ceil(this.myPageAryCount / this.length) : Math.ceil(this.products.length / this.length);
    this.onButtonClickPager(0);
  }
}
