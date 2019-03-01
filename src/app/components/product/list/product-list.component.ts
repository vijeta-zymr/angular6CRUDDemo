    /**
 * Created By : Vijeta Rathod
 */

import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../services/product/product';
// Services
import { ProductService } from '../../../services/product/product.service';
import { routerTransition } from '../../../services/config/config.service';
import { interval,timer,Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.css'],
	animations: [routerTransition()],
	host: { '[@routerTransition]': '' }
})

export class ProductListComponent implements OnInit {
	ProductList: any;
	ProductListData: any;
	private rec: Product;
	direction: number;
	isDesc: boolean = false;
	column: string = 'name';
	private unsubscribe$ = new Subject();

	constructor(private ProductService: ProductService, private toastr: ToastrService) { }
	// Call Product list function on page load
	ngOnInit() {
		timer(0,1000*60).subscribe(x => {
			this.getProductList();
		});		
	}
	ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
	sort(property){
		this.isDesc = !this.isDesc; //change the direction    
		this.column = property;
		this.direction = this.isDesc ? 1 : -1;
	}
	// Get Product list from services
	getProductList() {
		this.ProductService.getAllProductsByApi()
		.pipe(takeUntil(this.unsubscribe$))
		.subscribe(r => {
			this.rec = r as Product;
			console.log('this.rec',this.rec);	
			this.success(this.rec);	
		})
		// const ProductList = this.ProductService.getAllProducts();
		// this.success(ProductList);
	}

	// Get Product list success
	success(data) {
		console.log('data',data)
		this.ProductListData = data;
		for (let i = 0; i < this.ProductListData.length; i++) {
			this.ProductListData[i].name = this.ProductListData[i].name;
		}
	}

	// Delete a Product with its index
	deleteProduct(index: number) {
		// get confirm box for confirmation
		const r = confirm('Are you sure?');
		if (r === true) {
			const ProductDelete = this.ProductService.deleteProduct(index);
			if (ProductDelete) {
				this.toastr.success('Success', 'Product Deleted');
			}
			this.getProductList();
		}
	}

	addtocart(index: number) {
		// get confirm box for confirmation
		const r = confirm('Are you sure?');
		if (r === true) {
			const ProductAddCart = this.ProductService.doRegisterProduct(index);
			if (ProductAddCart) {
				this.toastr.success('Success', 'Product Added');
			}
			this.getProductList();
		}
	}
}
    /**
 * Created By : Vijeta Rathod
 */
