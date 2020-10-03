import { element } from 'protractor';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Products, ProductService } from '../shared/product.service';
import * as loadImage from 'blueimp-load-image';
import { SelectPrefectures } from 'src/app/util/prefectures';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { disableDebugTools } from '@angular/platform-browser';

interface Tokens {
  username: string;
  userId: string;
}

@Component({
  selector: 'app-product-post',
  templateUrl: './product-post.component.html',
  styleUrls: ['./product-post.component.scss']
})
export class ProductPostComponent implements OnInit {
  form: FormGroup;

  errors: any;
  tokenData: string = localStorage.getItem('app-meta');
  username: string;
  userId: string;
  createDate: Date;
  prefectures = SelectPrefectures;

  saveCoverImage1: any = null;
  saveCoverImage2: any = null;
  saveCoverImage3: any = null;

  isPosting: boolean = false;
  posting: boolean = false;

  options = {
    maxHeight: 1080,
    maxWidth: 1080,
    orientation: null,
    canvas: true
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder
  ) {
    const dataObj: Tokens = JSON.parse(this.tokenData);
    this.username = dataObj.username;
    this.userId = dataObj.userId;
    this.createDate = new Date();
  }

  ngOnInit() {
    this.form = this.createForm();
    this.addPostForm();
  }

  getDataUrl(blobImage: Blob, options: Object): Promise<any> {
    return new Promise((resolve) => {
      loadImage(blobImage, (canvas) => {
        resolve(canvas.toDataURL(blobImage.type));
      }, options);
    });
  }

  // アップロードするファイル名のラベル表示
  fileChange(index: number, element) {
    const label = document.getElementById('inputGroupFileText0' + index);
    label.innerText = this.checkFileAndgetFileName(index, element);
  }

  // ファイルチェックメソッド
  checkFileAndgetFileName(index: number, element: any): string {
    const file = element.target.files[0];
    const fileName: string = element.target.files[0].name;
    if (!this.check_extension(this.get_extension(fileName))) {
      return '拡張子が不正です';
    }
    this.CheckfileSizeAndgetInfo(file, index);
    return fileName;
  }

  // ファイルサイズをチェックして規定のサイズであればリサイズし、問題なければbase64化する
  CheckfileSizeAndgetInfo(file: File, index: number) {
    if (file.size >= 1000000) {
      loadImage.parseMetaData(file, (data) => {
        this.getDataUrl(file, this.options)
          .then(result => {
            if (index == 0) {
              this.saveCoverImage1 = result;
            } else if (index == 1) {
              this.saveCoverImage2 = result;
            } else {
              this.saveCoverImage3 = result;
            }
            console.log(result);
          });
      });
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (index == 0) {
          this.saveCoverImage1 = reader.result;
        } else if (index == 1) {
          this.saveCoverImage2 = reader.result;
        } else {
          this.saveCoverImage3 = reader.result;
        }
      };
    }
  }

  /**
   * inputの情報をjson形式として送信する
   * @param postForm postする情報
   */
  post(postForm) {
    // 保存する際は画像はBase64にエンコードされるので詰め替える
    const forms: Products = postForm.value;
    forms.postSize = this.postFroms.length;
    forms.coverImage1 = this.saveCoverImage1;
    forms.coverImage2 = this.saveCoverImage2;
    if (forms.postSize == 2 && this.saveCoverImage2 == null) {
      forms.coverImage2 = this.saveCoverImage3;
    } else {
      forms.coverImage2 = this.saveCoverImage2;
      forms.coverImage3 = this.saveCoverImage3;
    }
    forms.description1 = (document.getElementById('description0') as HTMLTextAreaElement).value;
    if (document.getElementById('description1') !== null) {
      forms.description2 = (document.getElementById('description1') as HTMLTextAreaElement).value;
    }
    if (document.getElementById('description2') !== null) {
      forms.description3 = (document.getElementById('description2') as HTMLTextAreaElement).value;
    }
    this.isPosting = true;
    this.productService.post(postForm.value).subscribe(
      (result) => {
        this.posting = false;
        this.isPosting = false;
        this.router.navigate(['/products']);
      },
      (err: HttpErrorResponse) => {
        this.isPosting = false;
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

  // フォーム複製
  createForm(): FormGroup {
    return this.fb.group({
      username: [''],
      userId: [''],
      createDate: [''],
      heading: [''],
      prefecture: [''],
      postFroms: this.fb.array([])
    })
  }

  createPostFormGroup(): FormGroup {
    return this.fb.group({
      coverImage: new FormControl(
        '',
        [
          Validators.required
        ]
      ),
      description: new FormControl(
        '',
        [
          Validators.required
        ]
      ),
    })
  }

  get postFroms(): FormArray {
    return this.form.get('postFroms') as FormArray
  }

  addPostForm() {
    this.postFroms.push(this.createPostFormGroup()) 
    setTimeout(() => {
      const formIndex = this.postFroms.length - 1;
      document.getElementById('description' + formIndex).focus();
    }, 300); 
  }
  removePostFormGroup(index: number) {
    this.postFroms.removeAt(index)
    const formIndex = index - 1;
      document.getElementById('description' + formIndex).focus();
  }
}
