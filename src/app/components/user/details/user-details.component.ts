
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../services/userdata/user';

// Services
import { UserdataService } from '../../../services/userdata/user.service';
import { routerTransition } from '../../../services/config/config.service';

@Component({
	selector: 'app-user-details',
	templateUrl: './user-details.component.html',
	styleUrls: ['./user-details.component.css'],
	animations: [routerTransition()],
	host: { '[@routerTransition]': '' }
})

export class UserDetailsComponent implements OnInit {
	@Input() UData: number;
	@Output() childEvent = new EventEmitter();

	index: any;
	UserDetail: any;
	private rec: User;
	private data: any;
	model = { options: '1'};
	chk1 = { options: false};
	chk2 = { options: true};
	chk3 = { options: false};
	chk4 = { options: true};
	private chkList = [];
	private chkListId = [];
	private qty:number = 1;
	private UserCartListData: any;
	// private chk = "1,3";
	constructor(private router: Router, private route: ActivatedRoute, private UserService: UserdataService, private toastr: ToastrService) {
		// Get user detail index number sent in params
		this.route.params.subscribe(params => {
			this.index = params['id'];
			if (this.index && this.index != null && this.index !== undefined) {
				this.getUserDetails(this.index);
			}
		});
	}

	onChange(value) {
		this.childEvent.emit(value);
	}

	ngOnInit() {
		console.log('in user detail component udata',this.UData);
		this.getUserDetails(this.UData);
	}

	// Get User details
	getUserDetails(index: number) {
		this.UserService.getUserDetails(index).subscribe(r => {
			this.UserDetail = r as User;
			console.log('this.UserDetail',this.UserDetail);
		  })
	}
	// Get User name
	getUserName(index: number) {
		this.UserService.getUserDetails(index).subscribe(r => {
			this.UserDetail = r as User;
			console.log('this.UserDetail.name',this.UserDetail.name);
			return this.UserDetail.name;
		})
	}
	
}

