    /**
 * Created By : Vijeta Rathod
 */

 import { Component, OnInit, ViewChild } from '@angular/core';
 import { RouterModule, Routes ,Router} from '@angular/router';
 import { ToastrService } from 'ngx-toastr';
 import { DatatableComponent } from '@swimlane/ngx-datatable';

 // Components
 import { StudentListComponent } from '../student/list/student-list.component';
 import { StudentDetailsComponent } from '../student/details/student-details.component';
 import { StudentAddComponent } from '../student/add/student-add.component';

 // Services
 import { routerTransition } from '../../services/config/config.service';
 import { User } from '../../services/userdata/user';

 @Component({
 	selector: 'app-dashboard',
 	templateUrl: './dashboard.component.html',
 	styleUrls: ['./dashboard.component.css'],
 	animations: [routerTransition()],
 	host: {'[@routerTransition]': ''}
 })


 export class DashboardComponent implements OnInit {
	@ViewChild(DatatableComponent) table:DatatableComponent;
	rows = [];
	 active:string;
	 private rec: User;
	 private loggedInUserId:number;
	 private loggedInUserRole:number;
 	constructor(private router: Router,private toastr: ToastrService) {
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

		this.rows = [
			{
				"name": "Ethel Price",
				"gender": "female",
				"company": "Johnson, Johnson and Partners, LLC CMP DDC",
				"age": 22
			},
			{
				"name": "Claudine Neal",
				"gender": "female",
				"company": "Sealoud",
				"age": 55
			},
			{
				"name": "Beryl Rice",
				"gender": "female",
				"company": "Velity",
				"age": 67
			},
			{
				"name": "Wilder Gonzales",
				"gender": "male",
				"company": "Geekko"
			},
			{
				"name": "Georgina Schultz",
				"gender": "female",
				"company": "Suretech"
			},
			{
				"name": "Carroll Buchanan",
				"gender": "male",
				"company": "Ecosys"
			}
		  ];
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
 }
 ];

    /**
 * Created By : Vijeta Rathod
 */
