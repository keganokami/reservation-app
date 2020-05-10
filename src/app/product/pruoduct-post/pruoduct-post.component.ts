import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Products } from '../shared/product.service';
import { DecimalPipe, DatePipe } from '@angular/common';

interface Tokens {
  username: string;
  userId: string;
}

@Component({
  selector: 'app-product-post',
  templateUrl: './pruoduct-post.component.html',
  styleUrls: ['./pruoduct-post.component.scss']
})
export class ProductPostComponent implements OnInit {
  errors: any;
  tokenData: string = localStorage.getItem('app-meta');
  username: string;
  userId: string;
  createDate: Date;

  firstUploadedFiles: Array<File> = null;
  secondUploadedFiles: Array<File> = null;
  thirdUploadedFiles: Array<File> = null;
  isDisabled: boolean = true;
  firstWillUploadFIleName: string = 'ファイルを選択してください';
  secondWillUploadFIleName: string = 'ファイルを選択してください';
  thirdWillUploadFIleName: string = 'ファイルを選択してください';
  saveCoverImage1: any = null;
  saveCoverImage2: any = null;
  saveCoverImage3: any = null;


  // tslint:disable-next-line: max-line-length
  constructor(
    private productService: ProductService,
    private router: Router,
    private http: HttpClient,
    private datePipe: DatePipe,
  ) {
    const dataObj: Tokens = JSON.parse(this.tokenData);
    this.username = dataObj.username;
    this.userId = dataObj.userId;
    // this.createDate = this.datePipe.transform(new Date(), 'yyyy/MM/dd HH/mm');
    this.createDate = new Date();
  }
  checkIsDisabled(): void {
    if (this.firstUploadedFiles === null) {
      this.isDisabled = true;
      return;
    }
    if (this.secondUploadedFiles === null) {
      this.isDisabled = true;
      return;
    }
    if (this.thirdUploadedFiles === null) {
      this.isDisabled = true;
      return;
    }
    this.isDisabled = false;
  }

  ngOnInit() {
  }

  // input=fileの書き戻し
  resetFirstFileInput() {
    this.firstWillUploadFIleName = 'ファイルを選択してください';
    this.firstUploadedFiles = null;
    this.checkIsDisabled();
  }

  resetSecondFileInput() {
    this.secondWillUploadFIleName = 'ファイルを選択してください';
    this.secondUploadedFiles = null;
    this.checkIsDisabled();
  }

  resetThirdFileInput() {
    this.thirdWillUploadFIleName = 'ファイルを選択してください';
    this.secondUploadedFiles = null;
    this.checkIsDisabled();
  }

  firstfileChange(element) {
    const file = element.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.firstWillUploadFIleName = '拡張子が不正です';
      this.firstUploadedFiles = null;
      this.checkIsDisabled();
      return;
    }
    reader.onload = () => {
      this.saveCoverImage1 = reader.result;
    };
    this.firstWillUploadFIleName = fileName;
    this.firstUploadedFiles = element.target.files;
    this.checkIsDisabled();
  }
  secondFileChange(element) {
    const file = element.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.secondWillUploadFIleName = '拡張子が不正です';
      this.secondUploadedFiles = null;
      this.checkIsDisabled();
      return;
    }
    reader.onload = () => {
      this.saveCoverImage2 = reader.result;
    };
    this.secondWillUploadFIleName = fileName;
    this.secondUploadedFiles = element.target.files;
    this.checkIsDisabled();
  }

  thirdFileChange(element) {
    const file = element.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.thirdWillUploadFIleName = '拡張子が不正です';
      this.thirdUploadedFiles = null;
      this.checkIsDisabled();
      return;
    }
    reader.onload = () => {
      this.saveCoverImage3 = reader.result;
    };
    this.thirdWillUploadFIleName = fileName;
    this.thirdUploadedFiles = element.target.files;
    this.checkIsDisabled();
  }

  post(postForm) {
    // this.upload();
    const forms: Products = postForm.value;
    forms.coverImage1 = this.saveCoverImage1;
    forms.coverImage2 = this.saveCoverImage2;
    forms.coverImage3 = this.saveCoverImage3;
    this.productService.post(postForm.value).subscribe(
      (result) => {
        this.router.navigate(['/products']);
      },
      (err: HttpErrorResponse) => {
        this.errors = err.error.error;
      }
    );
  }

  get_extension(filename: string): string {
    const ext: number = filename.lastIndexOf('.');
    return ext === -1 ? '' : filename.slice(ext);
  }

  check_extension(ext: string): boolean {
    const allowExt = new Array('.jpg', '.jpeg', '.png');
    return allowExt.indexOf(ext.toLowerCase()) === -1 ? false : true;
  }
}
