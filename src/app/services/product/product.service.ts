    /**
 * Created By : Vijeta Rathod
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/products';
  private apiCartUrl = 'http://localhost:3000/cart';
  // Get all Products list via API or any data storage
  // getAllProducts() {
  //   let ProductList: any;
  //   if (localStorage.getItem('Products') && localStorage.getItem('Products') !== '') {
  //     ProductList = {
  //       code: 200,
  //       message: 'Products List Fetched Successfully',
  //       data: JSON.parse(localStorage.getItem('Products'))
  //     };
  //   } else {
  //     ProductList = {
  //       code: 200,
  //       message: 'Products List Fetched Successfully',
  //       data: JSON.parse(localStorage.getItem('Products'))
  //     };
  //   }
  //   return ProductList;
  // }
  getAllProductsByApi(): Observable<any> {
    return this.http.get<any>(this.apiUrl)
  }
  getAllCartProductsByApi(): Observable<any> {
    return this.http.get<any>(this.apiCartUrl)
  }
  doRegisterProduct(index) {
    const ProductList = JSON.parse(localStorage.getItem('Products'));
    let returnData;
    console.log('index', index);
    if (index != null) {
      // for (let i = 0; i < ProductList.length; i++) {
      //   if (index !== i && ProductList[i].email === data.email) {
      //     returnData = {
      //       code: 503,
      //       message: 'Email Address Already In Use',
      //       data: null
      //     };
      //     return returnData;
      //   }
      // }

      ProductList[index] = index;
      localStorage.setItem('Products', JSON.stringify(ProductList));
      console.log('local storage ProductList',ProductList);
      returnData = {
        code: 200,
        message: 'Product Successfully Updated',
        data: JSON.parse(localStorage.getItem('Products'))
      };
    } 
    return returnData;
  }
  doRegister(data): Observable<any> {
      console.log('add data',data)
			return this.http.post(this.apiUrl,data);	
    }
  addtocart(data): Observable<any> {
      console.log('add cart data',data)
			return this.http.post(this.apiCartUrl,data);	
    }
  updatetocart(data,index:number): Observable<any> {
      console.log('update cart data',data,'index',index)
			return this.http.put(this.apiCartUrl+'/'+index,data);	
		}
  deleteProduct(index: number) {
    const ProductList = JSON.parse(localStorage.getItem('Products'));

    ProductList.splice(index, 1);

    localStorage.setItem('Products', JSON.stringify(ProductList));

    const returnData = {
      code: 200,
      message: 'Product Successfully Deleted',
      data: JSON.parse(localStorage.getItem('Products'))
    };

    return returnData;
  }



  getProductDetails(index: number): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/'+index)

    // const ProductList = JSON.parse(localStorage.getItem('Products'));

    // const returnData = {
    //   code: 200,
    //   message: 'Product Details Fetched',
    //   ProductData: ProductList[index]
    // };

    // return returnData;
  }


  generateRandomID() {
    const x = Math.floor((Math.random() * Math.random() * 9999));
    return x;
  }

}
    /**
 * Created By : Vijeta Rathod
 */
