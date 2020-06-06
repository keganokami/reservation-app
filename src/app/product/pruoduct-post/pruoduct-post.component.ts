import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Products, ProductService } from '../shared/product.service';
import * as loadImage from 'blueimp-load-image';
import { SelectPrefectures } from 'src/app/util/prefectures';

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
  prefectures = SelectPrefectures;

  firstUploadedFiles: Array<File> = null;
  secondUploadedFiles: Array<File> = null;
  thirdUploadedFiles: Array<File> = null;

  firstWillUploadFIleName: string = 'ファイルを選択してください';
  secondWillUploadFIleName: string = 'ファイルを選択してください';
  thirdWillUploadFIleName: string = 'ファイルを選択してください';
  saveCoverImage1: any = null;
  saveCoverImage2: any = null;
  saveCoverImage3: any = null;

  options = {
    maxHeight: 1200,
    maxWidth: 1200,
    orientation: null,
    canvas: true
  };

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {
    const dataObj: Tokens = JSON.parse(this.tokenData);
    this.username = dataObj.username;
    this.userId = dataObj.userId;
    this.createDate = new Date();
  }

  ngOnInit() {
  }

  // input=fileの書き戻し
  resetFirstFileInput() {
    this.firstWillUploadFIleName = 'ファイルを選択してください';
    this.firstUploadedFiles = null;
  }

  resetSecondFileInput() {
    this.secondWillUploadFIleName = 'ファイルを選択してください';
    this.secondUploadedFiles = null;
  }

  resetThirdFileInput() {
    this.thirdWillUploadFIleName = 'ファイルを選択してください';
    this.secondUploadedFiles = null;
  }

  getDataUrl(blobImage: Blob, options: Object): Promise<any> {
    return new Promise((resolve) => {
      loadImage(blobImage, (canvas) => {
        resolve(canvas.toDataURL(blobImage.type));
      }, options);
    });
  }

  firstfileChange(element) {
    const file = element.target.files[0];
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.firstWillUploadFIleName = '拡張子が不正です';
      this.firstUploadedFiles = null;
      return;
    }
    if (file.size >= 1000000) {
      loadImage.parseMetaData(file, (data) => {
        console.log(file);
        this.getDataUrl(file, this.options)
          .then(result => {
            this.saveCoverImage1 = result;
            console.log(result);
          });
      });
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.saveCoverImage1 = reader.result;
      };
    }

    this.firstWillUploadFIleName = fileName;
    this.firstUploadedFiles = element.target.files;
  }

  secondFileChange(element) {
    const file = element.target.files[0];
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.secondWillUploadFIleName = '拡張子が不正です';
      this.secondUploadedFiles = null;
      return;
    }
    if (file.size >= 1000000) {
      loadImage.parseMetaData(file, (data) => {
        console.log(file);
        this.getDataUrl(file, this.options)
          .then(result => {
            this.saveCoverImage2 = result;
            console.log(result);
          });
      });
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.saveCoverImage2 = reader.result;
      };
    }
    this.secondWillUploadFIleName = fileName;
    this.secondUploadedFiles = element.target.files;
  }

  thirdFileChange(element) {
    const file = element.target.files[0];
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.thirdWillUploadFIleName = '拡張子が不正です';
      this.thirdUploadedFiles = null;
      return;
    }
    if (file.size >= 1000000) {
      loadImage.parseMetaData(file, (data) => {
        console.log(file);
        this.getDataUrl(file, this.options)
          .then(result => {
            this.saveCoverImage3 = result;
            console.log(result);
          });
      });
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.saveCoverImage3 = reader.result;
      };
    }

    this.thirdWillUploadFIleName = fileName;
    this.thirdUploadedFiles = element.target.files;
  }

  /**
   * inputの情報をjson形式として送信する
   * @param postForm postする情報
   */
  post(postForm) {
    // 保存する際は画像はBase64にエンコードされるので詰め替える
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

  /*
  * 入力したファイルの拡張子を取得する関数
  */
  get_extension(filename: string): string {
    const ext: number = filename.lastIndexOf('.');
    return ext === -1 ? '' : filename.slice(ext);
  }

  /*
  * 拡張子をチェックする関数
  */
  check_extension(ext: string): boolean {
    const allowExt = new Array('.jpg', '.jpeg', '.png');
    return allowExt.indexOf(ext.toLowerCase()) === -1 ? false : true;
  }
}
