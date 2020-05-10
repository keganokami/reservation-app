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
  saveCoverImage1: string = null;
  saveCoverImage2: string = null;
  saveCoverImage3: string = null;
  saveCoverImageExt1: string = null;
  saveCoverImageExt2: string = null;
  saveCoverImageExt3: string = null;


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
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.firstWillUploadFIleName = '拡張子が不正です';
      this.firstUploadedFiles = null;
      this.checkIsDisabled();
      return;
    }
    this.firstWillUploadFIleName = fileName;
    this.firstUploadedFiles = element.target.files;
    this.checkIsDisabled();
  }
  secondFileChange(element) {
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.secondWillUploadFIleName = '拡張子が不正です';
      this.secondUploadedFiles = null;
      this.checkIsDisabled();
      return;
    }
    this.secondWillUploadFIleName = fileName;
    this.secondUploadedFiles = element.target.files;
    this.checkIsDisabled();
  }

  thirdFileChange(element) {
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.thirdWillUploadFIleName = '拡張子が不正です';
      this.thirdUploadedFiles = null;
      this.checkIsDisabled();
      return;
    }
    this.thirdWillUploadFIleName = fileName;
    this.thirdUploadedFiles = element.target.files;
    this.checkIsDisabled();
  }

  post(postForm) {
    this.upload();
    debugger
    const forms: Products = postForm.value;
    forms.coverImage1 = this.saveCoverImage1 + this.saveCoverImageExt1;
    forms.coverImage2 = this.saveCoverImage2 + this.saveCoverImageExt2;
    forms.coverImage3 = this.saveCoverImage3 + this.saveCoverImageExt3;
    this.productService.post(postForm.value).subscribe(
      (result) => {
        this.router.navigate(['/products']);
      },
      (err: HttpErrorResponse) => {
        this.errors = err.error.error;
      }
    );
  }

  upload() {
    const formData = new FormData();
    if (this.firstUploadedFiles !== null) {
      this.saveCoverImage1 = this.createRandomStr();
      this.saveCoverImageExt1 = this.get_extension(this.firstUploadedFiles[0].name);
      this.createFormData(this.firstUploadedFiles, formData, this.saveCoverImage1, this.saveCoverImageExt1);
    }
    if (this.secondUploadedFiles !== null) {
      this.saveCoverImage2 = this.createRandomStr();
      this.saveCoverImageExt2 = this.get_extension(this.secondUploadedFiles[0].name);
      this.createFormData(this.secondUploadedFiles, formData, this.saveCoverImage2, this.saveCoverImageExt2);
    }
    if (this.thirdUploadedFiles !== null) {
      this.saveCoverImage3 = this.createRandomStr();
      this.saveCoverImageExt3 = this.get_extension(this.thirdUploadedFiles[0].name);
      this.createFormData(this.thirdUploadedFiles, formData , this.saveCoverImage3, this.saveCoverImageExt3);
    }

    this.http.post('/api/upload', formData)
      .subscribe((response) => {
        console.log('response received is ', response);
      });
  }

  createFormData(files: Array<File>, data: FormData, fileName: string, ext: string): void {
    for (const file of files) {
      if (!this.check_extension(ext)) {
        return;
      }
      data.append('uploads[]', file, fileName + ext);
    }
  }

  createRandomStr(): string {
    // 生成する文字列の長さ
    const l = 20;
    // 生成する文字列に含める文字セット
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const cl = c.length;
    let r = '';
    for (let i = 0; i < l; i++) {
      r += c[Math.floor(Math.random() * cl)];
    }
    return r;
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
