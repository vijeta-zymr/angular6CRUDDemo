    /**
 * Created By : Vijeta Rathod
 */
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

// Services
import { ValidationService } from '../../../services/config/config.service';
import { ProductService } from '../../../services/product/product.service';
import { routerTransition } from '../../../services/config/config.service';

import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../services/product/product';

@Component({
	selector: 'app-product-add',
	templateUrl: './product-add.component.html',
	styleUrls: ['./product-add.component.css'],
	animations: [routerTransition()],
	host: { '[@routerTransition]': '' }
})

export class ProductAddComponent implements OnInit {
	// create ProductAddForm of type FormGroup
	ProductAddForm: FormGroup;
	index: any;
	private rec: Product;

	constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private ProductService: ProductService, private toastr: ToastrService) {

		// Check for route params
		this.route.params.subscribe(params => {
			this.index = params['id'];
			// check if ID exists in route & call update or add methods accordingly
			if (this.index && this.index !== null && this.index !== undefined) {
				this.getProductDetails(this.index);
			} else {
				this.createForm(null);
			}
		});
	}

	ngOnInit() {
	}

	// Submit Product details form
	doRegister() {
		if (this.index && this.index !== null && this.index !== undefined) {
			this.ProductAddForm.value.id = this.index;
		} else {
			this.index = null;
		}

		this.ProductService.doRegister(this.ProductAddForm.value).subscribe(r => {
			this.rec = r as Product;
			console.log('this.rec',this.rec);
			if (this.rec) {
				const ProductRegister = {
					code: 200,
					message: 'Product Successfully Added',
					data: JSON.parse(localStorage.getItem('students'))
				  }
				this.toastr.success(ProductRegister.message, 'Success');
				this.router.navigate(['/product']);
			} else {
				const ProductRegister = {
					code: 200,
					message: 'Product Not Added',
					data: JSON.parse(localStorage.getItem('students'))
				  }
				this.toastr.error(ProductRegister.message, 'Failed');
			}
		  })

		// const ProductRegister = this.ProductService.doRegister(this.index);
		// if (ProductRegister) {
		// 	if (ProductRegister.code === 200) {
		// 		this.toastr.success(ProductRegister.message, 'Success');
		// 		this.router.navigate(['/']);
		// 	} else {
		// 		this.toastr.error(ProductRegister.message, 'Failed');
		// 	}
		// }
	}

	// If this is update form, get user details and update form
	getProductDetails(index: number) {
		const ProductDetail = this.ProductService.getProductDetails(index);
		this.createForm(ProductDetail);
	}

	// If this is update request then auto fill form
	createForm(data) {
		if (data === null) {
			this.ProductAddForm = this.formBuilder.group({
				name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
				desc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
				qty: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
				price: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			});
		} else {
			this.ProductAddForm = this.formBuilder.group({
				name: [data.ProductData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
				desc: [data.ProductData.desc, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
				qty: [data.ProductData.qty, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
				price: [data.ProductData.price, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			});
		}
	}

}

    /**
 * Created By : Vijeta Rathod
 */