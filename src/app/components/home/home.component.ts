    /**
 * Created By : Vijeta Rathod
 */

 import { Component, OnInit } from '@angular/core';
 import { RouterModule, Routes ,Router} from '@angular/router';
 import { ToastrService } from 'ngx-toastr';

 // Components
 import { StudentListComponent } from '../student/list/student-list.component';
 import { StudentDetailsComponent } from '../student/details/student-details.component';
 import { StudentAddComponent } from '../student/add/student-add.component';

 import { ProductListComponent } from '../product/list/product-list.component';
 import { ProductDetailsComponent } from '../product/details/product-details.component';
 import { ProductAddComponent } from '../product/add/product-add.component';
 import { CartComponent } from '../cart/cart.component';

 import { ObservableComponent } from '../observable/observable/observable.component';
 import { LearnrxjsComponent } from '../learnrxjs/learnrxjs.component'

 import { UserListComponent } from '../user/list/user-list.component';
 import { UserDetailsComponent } from '../user/details/user-details.component';
 import { UserAddComponent } from '../user/add/user-add.component';
 // Services
 import { routerTransition } from '../../services/config/config.service';
 import { User } from '../../services/userdata/user';
 import { ModalService } from '../../services/modal/modal.service'
 @Component({
 	selector: 'app-home',
 	templateUrl: './home.component.html',
 	styleUrls: ['./home.component.css'],
 	animations: [routerTransition()],
 	host: {'[@routerTransition]': ''}
 })


 export class HomeComponent implements OnInit {
	 active:string;
	 private rec: User;
	 private loggedInUserId:number;
	 private loggedInUserRole:number;
 	constructor(private router: Router,private toastr: ToastrService, private modalService: ModalService) {
 		// Detect route changes for active sidebar menu
 		this.router.events.subscribe((val) => {
 			this.routeChanged(val);
 		});
 	}

 	ngOnInit() {
		console.log('local storage home',localStorage.getItem('userData'));
		this.rec = JSON.parse(localStorage.getItem('userData'));
		this.loggedInUserId = this.rec.id;
		this.loggedInUserRole = this.rec.role;
		console.log('this.loggedInUserId',this.loggedInUserId);
 	}

 	// Detect route changes for active sidebar menu
 	routeChanged(val){
 		this.active = val.url;
 	}

 	// Logout User
 	logOut(){
 		this.toastr.success('Success', "Logged Out Successfully");
 		localStorage.removeItem('userData');
 		this.router.navigate(['/login']);
	 }
 }


 // Define and export child routes of HomeComponent
 export const homeChildRoutes : Routes = [
	{
		path: '',
		component: StudentListComponent
	},
	{
		path: 'add',
		component: StudentAddComponent
	},
	{
		path: 'update/:id',
		component: StudentAddComponent
	},
	{
		path: 'detail/:id',
		component: StudentDetailsComponent
	},
	{
		path: 'product',
		component: ProductListComponent
	},
	{
		path: 'product/add',
		component: ProductAddComponent
	},
	{
		path: 'product/update/:id',
		component: ProductAddComponent
	},
	{
		path: 'product/detail/:id',
		component: ProductDetailsComponent
	},
	{
		path: 'cart',
		component: CartComponent
	},
	{
		path: 'user',
		component: UserListComponent
	},
	{
		path: 'user/add',
		component: UserAddComponent
	},
	{
		path: 'user/update/:id',
		component: UserAddComponent
	},
	{
		path: 'user/detail/:id',
		component: UserDetailsComponent
	},
	{
		path: 'user/profile/:id',
		component: UserDetailsComponent
	},
	{
		path: 'observable',
		component: ObservableComponent
	},
	{
		path: 'learnrxjs',
		component: LearnrxjsComponent
	}
 ];

    /**
 * Created By : Vijeta Rathod
 */
