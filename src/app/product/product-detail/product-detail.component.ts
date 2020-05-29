import { Component, OnInit, EventEmitter, Output, OnChanges, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ProductService, Products } from '../shared/product.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';
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
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnChanges {
  @Output() titleChanged: EventEmitter<string> = new EventEmitter<string>();
  textareaForm = new FormGroup({
    address: new FormControl()
  });

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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
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

  getSelectedPref(event: any) {
    this.selectedPrefecture = event;
  }

  getData() {
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
}
