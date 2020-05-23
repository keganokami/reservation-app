import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ProductService, Products } from '../shared/product.service';
import { Router } from '@angular/router';
import { products } from 'src/app/products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnChanges {

  @Input() products: Products[];
  isPrevPage: boolean = false;
  pageNum: number[] = [];
  begin: number = 0;
  length: number = 8;
  pageNumBox: number[]; // pageの配列
  isActivePage: number = 0;　// アクティブなページ
  pageAryCount: number;

  constructor(private productService: ProductService, private router: Router) {
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
}
