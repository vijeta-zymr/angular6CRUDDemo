
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../services/product/product';

// Services
import { ProductService } from '../../../services/product/product.service';
import { routerTransition } from '../../../services/config/config.service';

@Component({
	selector: 'app-product-details',
	templateUrl: './product-details.component.html',
	styleUrls: ['./product-details.component.css'],
	animations: [routerTransition()],
	host: { '[@routerTransition]': '' }
})

export class ProductDetailsComponent implements OnInit {
	index: any;
	ProductDetail: any;
	private rec: Product;
	private data: any;
	model = { options: '1'};
	chk1 = { options: false};
	chk2 = { options: true};
	chk3 = { options: false};
	chk4 = { options: true};
	private chkList = [];
	private chkListId = [];
	private qty:number = 1;
	private ProductCartListData: any;
	// private chk = "1,3";
	constructor(private router: Router, private route: ActivatedRoute, private ProductService: ProductService, private toastr: ToastrService) {
		// Get user detail index number sent in params
		this.route.params.subscribe(params => {
			this.index = params['id'];
			if (this.index && this.index != null && this.index !== undefined) {
				this.getProductDetails(this.index);
			}
		});
	}

	ngOnInit() {
	}

	// Get Product details
	getProductDetails(index: number) {
		this.ProductService.getProductDetails(index).subscribe(r => {
			this.ProductDetail = r as Product;
			console.log('this.ProductDetail',this.ProductDetail);
		  })
	}
	// Get Product name
	getProductName(index: number) {
		this.ProductService.getProductDetails(index).subscribe(r => {
			this.ProductDetail = r as Product;
			console.log('this.ProductDetail.name',this.ProductDetail.name);
			return this.ProductDetail.name;
		})
	}
	addtocart(index: number) {
		this.ProductService.getProductDetails(index).subscribe(r => {
			this.ProductDetail = r as Product;
			
			if(this.chk1.options == true){
				this.chkListId.push(1);
				this.chkList.push('Cheese Brust');
			}
			if(this.chk2.options == true){
				this.chkListId.push(2);
				this.chkList.push('Alpino');
			}
			if(this.chk3.options == true){
				this.chkListId.push(3);
				this.chkList.push('Capcicum');
			}
			if(this.chk4.options == true){
				this.chkListId.push(4);
				this.chkList.push('Baby Corn');
			}
			
			var object = {};
			object["productid"] = index;
			object["productname"] = this.ProductDetail.name;
			object["variant"] = this.model.options;
			object["options"] = this.chkList;
			object["optionsid"] = this.chkListId;
			object["qty"] = this.qty;	
			object["price"] = this.ProductDetail.price;
			console.log('object',object);
			
			//get existing product details from cart
			this.ProductService.getAllCartProductsByApi().subscribe(r => {
				this.ProductCartListData = r;
				console.log('this.ProductCartListData',this.ProductCartListData);

				let data = this.ProductCartListData.find(ob => ob['productid'] === object["productid"]);
				console.log('data',data);
				
				if (data) {
					console.log('update cart');
					object["qty"] = data.qty + 1;	
					object["price"] = +data.price + +this.ProductDetail.price;
					this.ProductService.updatetocart(object,data.id).subscribe(r => {
						this.rec = r as Product;
						console.log('this.rec',this.rec);
						if (this.rec) {
							const ProductRegister = {
								code: 200,
								message: 'Product Successfully Added',
								data: JSON.parse(localStorage.getItem('students'))
							  }
							this.toastr.success(ProductRegister.message, 'Success');
							this.router.navigate(['/cart']);
						} else {
							const ProductRegister = {
								code: 200,
								message: 'Product Not Added',
								data: JSON.parse(localStorage.getItem('students'))
							  }
							this.toastr.error(ProductRegister.message, 'Failed');
						}
					  })
				} else {
					console.log('add cart');
					this.ProductService.addtocart(object).subscribe(r => {
						this.rec = r as Product;
						console.log('this.rec',this.rec);
						if (this.rec) {
							const ProductRegister = {
								code: 200,
								message: 'Product Successfully Added',
								data: JSON.parse(localStorage.getItem('students'))
							  }
							this.toastr.success(ProductRegister.message, 'Success');
							this.router.navigate(['/cart']);
						} else {
							const ProductRegister = {
								code: 200,
								message: 'Product Not Added',
								data: JSON.parse(localStorage.getItem('students'))
							  }
							this.toastr.error(ProductRegister.message, 'Failed');
						}
					  })
				}
			})

			
		})
	}
}

