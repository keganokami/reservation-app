import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Products, ProductService } from '../shared/product.service';
import * as loadImage from 'blueimp-load-image';
declare function require(x: string): any;
// const Compressor = require('Compressor');
import Compressor from 'compressorjs';
const SelectPrefectures = {
  states: [
    { value: '01', viewValue: '北海道' },
    { value: '02', viewValue: '青森県' },
    { value: '03', viewValue: '岩手県' },
    { value: '04', viewValue: '宮城県' },
    { value: '05', viewValue: '秋田県' },
    { value: '06', viewValue: '山形県' },
    { value: '07', viewValue: '福島県' },
    { value: '08', viewValue: '茨城県' },
    { value: '09', viewValue: '栃木県' },
    { value: '10', viewValue: '群馬県' },
    { value: '11', viewValue: '埼玉県' },
    { value: '12', viewValue: '千葉県' },
    { value: '13', viewValue: '東京都' },
    { value: '14', viewValue: '神奈川県' },
    { value: '15', viewValue: '新潟県' },
    { value: '16', viewValue: '富山県' },
    { value: '17', viewValue: '石川県' },
    { value: '18', viewValue: '福井県' },
    { value: '19', viewValue: '山梨県' },
    { value: '20', viewValue: '長野県' },
    { value: '21', viewValue: '岐阜県' },
    { value: '22', viewValue: '静岡県' },
    { value: '23', viewValue: '愛知県' },
    { value: '24', viewValue: '三重県' },
    { value: '25', viewValue: '滋賀県' },
    { value: '26', viewValue: '京都府' },
    { value: '27', viewValue: '大阪府' },
    { value: '28', viewValue: '兵庫県' },
    { value: '29', viewValue: '奈良県' },
    { value: '30', viewValue: '和歌山県' },
    { value: '31', viewValue: '鳥取県' },
    { value: '32', viewValue: '島根県' },
    { value: '33', viewValue: '岡山県' },
    { value: '34', viewValue: '広島県' },
    { value: '35', viewValue: '山口県' },
    { value: '36', viewValue: '徳島県' },
    { value: '37', viewValue: '香川県' },
    { value: '38', viewValue: '愛媛県' },
    { value: '39', viewValue: '高知県' },
    { value: '40', viewValue: '福岡県' },
    { value: '41', viewValue: '佐賀県' },
    { value: '42', viewValue: '長崎県' },
    { value: '43', viewValue: '熊本県' },
    { value: '44', viewValue: '大分県' },
    { value: '45', viewValue: '宮崎県' },
    { value: '46', viewValue: '鹿児島県' },
    { value: '47', viewValue: '沖縄県' }
  ]
};
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

  getDataUrl(blobImage: Blob, options: any): Promise<any> {
    return new Promise((resolve) => {
      loadImage(blobImage, (canvas) => {
        resolve(canvas.toDataURL(blobImage.type));
      }, options);
    });
  }

  firstfileChange(element) {
    debugger
    const file = element.target.files[0];
    let DataURL;
    loadImage.parseMetaData(file, (data) => {
      const options = {
        orientation: null,
        canvas: true
      };
      if (data.exif) {
        options.orientation = data.exif.get('Orientation');
      }
      this.getDataUrl(file, options)
        .then(result => {
          DataURL = result;
        });
    });
    const reader = new FileReader();
    // reader.readAsDataURL(file);
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.firstWillUploadFIleName = '拡張子が不正です';
      this.firstUploadedFiles = null;
      return;
    }
    if (file.size >= 1000000) {
      this.firstWillUploadFIleName = 'ファイルサイズが大きすぎます';
      this.firstUploadedFiles = null;
      return;
    }
    reader.onload = () => {
      this.saveCoverImage1 = DataURL;
    };
    this.firstWillUploadFIleName = fileName;
    this.firstUploadedFiles = element.target.files;
  }
  secondFileChange(element) {
    const file = element.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.secondWillUploadFIleName = '拡張子が不正です';
      this.secondUploadedFiles = null;
      return;
    }
    if (file.size >= 1000000) {
      this.firstWillUploadFIleName = 'ファイルサイズが大きすぎます';
      this.firstUploadedFiles = null;
      return;
    }
    reader.onload = () => {
      this.saveCoverImage2 = reader.result;
    };
    this.secondWillUploadFIleName = fileName;
    this.secondUploadedFiles = element.target.files;
  }

  thirdFileChange(element) {
    const file = element.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      this.thirdWillUploadFIleName = '拡張子が不正です';
      this.thirdUploadedFiles = null;
      return;
    }
    if (file.size >= 1000000) {
      this.firstWillUploadFIleName = 'ファイルサイズが大きすぎます';
      this.firstUploadedFiles = null;
      return;
    }
    reader.onload = () => {
      this.saveCoverImage3 = reader.result;
    };
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
