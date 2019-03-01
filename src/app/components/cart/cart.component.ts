import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../services/product/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit {
  ProductListData: any;
  ProductDetail: any;
  constructor(private ProductService: ProductService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getProductList();
  }
  
  // Get Cart Product list from services
	getProductList() {
		this.ProductService.getAllCartProductsByApi().subscribe(r => {
      this.ProductListData = r;
		  })
	}
}
