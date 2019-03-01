    /**
 * Created By : Vijeta Rathod
 */

import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../services/userdata/user';
// Services
import { UserdataService } from '../../../services/userdata/user.service';
import { routerTransition } from '../../../services/config/config.service';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css'],
	animations: [routerTransition()],
	host: { '[@routerTransition]': '' }
})

export class UserListComponent implements OnInit {
	
	private modalUId: number;
	public CData: number;
	UserList: any;
	UserListData: any;
	private rec: User;
	direction: number;
	isDesc: boolean = false;
  column: string = 'name';
	constructor(private UserService: UserdataService, private toastr: ToastrService, private modalService: ModalService) { }
	// Call User list function on page load
	ngOnInit() {
			this.getUserList();
	}
	sort(property){
		this.isDesc = !this.isDesc; //change the direction    
		this.column = property;
		this.direction = this.isDesc ? 1 : -1;
	}
	// Get User list from services
	getUserList() {
		this.UserService.getAllUsersByApi().subscribe(r => {
			this.rec = r as User;
			console.log('this.rec',this.rec);	
			this.success(this.rec);	
		  })

		// const UserList = this.UserService.getAllUsers();
		// this.success(UserList);
	}

	// Get User list success
	success(data) {
		console.log('data',data)
		this.UserListData = data;
		for (let i = 0; i < this.UserListData.length; i++) {
			this.UserListData[i].name = this.UserListData[i].name;
		}
	}

	// Delete a User with its index
	deleteUser(index: number) {
		// get confirm box for confirmation
		const r = confirm('Are you sure?');
		if (r === true) {
			const UserDelete = this.UserService.deleteUser(index);
			if (UserDelete) {
				this.toastr.success('Success', 'User Deleted');
			}
			this.getUserList();
		}
	}

	addtocart(index: number) {
		// get confirm box for confirmation
		const r = confirm('Are you sure?');
		if (r === true) {
			const UserAddCart = this.UserService.doRegisterUser(index);
			if (UserAddCart) {
				this.toastr.success('Success', 'User Added');
			}
			this.getUserList();
		}
	}
	openModal(id: string, userId: number) {
		console.log('open modal');
		this.modalUId = userId;
		this.modalService.open(id,userId);
	}

	closeModal(id: string) {
		 	this.modalUId = null;
			this.modalService.close(id);
	}
}
    /**
 * Created By : Vijeta Rathod
 */
