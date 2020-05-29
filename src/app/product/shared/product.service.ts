import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Products {
  _id: string; // mongoDBのオブジェクトID
  username?: string; // localStrageから取得して送る
  userId?: string; 　// localStrageから取得して送る
  heading: string;
  prefecture: string;
  coverImage1: string;
  coverImage2: string;
  coverImage3: string;
  // heading1: string;
  // heading2?: string;
  // heading3?: string;
  description1: string;
  description2?: string;
  description3?: string;
  createDate?: Date; // js で作る
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get('/api/v1/products');
  }

  getProductById(productId: string): Observable<any> {
    return this.http.get('/api/v1/products/' + productId);
  }

  post(postData: Products): Observable<any> {
    return this.http.post('/api/v1/products/posts', postData);
  }

  upload(images: any): Observable<any> {
      return this.http.post('/api/v1/products/upload', images);
  }

  updateOne(updateData: Products): Observable<any> {
    return this.http.put('/api/v1/products/update', updateData);
  }
}
