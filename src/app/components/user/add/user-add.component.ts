    /**
 * Created By : Vijeta Rathod
 */
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

// Services
import { ValidationService } from '../../../services/config/config.service';
import { UserdataService } from '../../../services/userdata/user.service';
import { routerTransition } from '../../../services/config/config.service';

import { ToastrService } from 'ngx-toastr';
import { User } from '../../../services/userdata/user';

@Component({
	selector: 'app-user-add',
	templateUrl: './user-add.component.html',
	styleUrls: ['./user-add.component.css'],
	animations: [routerTransition()],
	host: { '[@routerTransition]': '' }
})

export class UserAddComponent implements OnInit {
	// create UserAddForm of type FormGroup
	UserAddForm: FormGroup;
	index: any;
	private rec: User;
	model = { options: '1'};

	constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private UserService: UserdataService, private toastr: ToastrService) {

		// Check for route params
		this.route.params.subscribe(params => {
			this.index = params['id'];
			// check if ID exists in route & call update or add methods accordingly
			if (this.index && this.index !== null && this.index !== undefined) {
				this.getUserDetails(this.index);
			} else {
				this.createForm(null);
			}
		});
	}

	ngOnInit() {
	}

	// Submit User details form
	doRegister() {
		if (this.index && this.index !== null && this.index !== undefined) {
			this.UserAddForm.value.id = this.index;
		} else {
			this.index = null;
		}

		this.UserService.doRegister(this.UserAddForm.value).subscribe(r => {
			this.rec = r as User;
			console.log('this.rec add user data',this.rec);
			if (this.rec) {
				const UserRegister = {
					code: 200,
					message: 'User Successfully Added',
					data: JSON.parse(localStorage.getItem('user'))
				  }
				this.toastr.success(UserRegister.message, 'Success');
				this.router.navigate(['/user']);
			} else {
				const UserRegister = {
					code: 200,
					message: 'User Not Added',
					data: JSON.parse(localStorage.getItem('user'))
				  }
				this.toastr.error(UserRegister.message, 'Failed');
			}
		  })

		// const UserRegister = this.UserService.doRegister(this.index);
		// if (UserRegister) {
		// 	if (UserRegister.code === 200) {
		// 		this.toastr.success(UserRegister.message, 'Success');
		// 		this.router.navigate(['/']);
		// 	} else {
		// 		this.toastr.error(UserRegister.message, 'Failed');
		// 	}
		// }
	}

	// If this is update form, get user details and update form
	getUserDetails(index: number) {
		const UserDetail = this.UserService.getUserDetails(index);
		this.createForm(UserDetail);
	}

	// If this is update request then auto fill form
	createForm(data) {
		if (data === null) {
			this.UserAddForm = this.formBuilder.group({
				name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
				email: ['', [Validators.required, ValidationService.emailValidator]],
				password: ['', [
					Validators.required,
					Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
				   ]],
				role: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
			});
		} else {
			this.UserAddForm = this.formBuilder.group({
				name: [data.UserData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
				email: [data.UserData.email, [Validators.required, ValidationService.emailValidator]],
				password: ['', [
					Validators.required,
					Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
				   ]],
				role: [data.UserData.role, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
			});
		}
	}

}

    /**
 * Created By : Vijeta Rathod
 */
