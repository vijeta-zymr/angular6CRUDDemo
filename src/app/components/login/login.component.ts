    /**
 * Created By : Vijeta Rathod
 */

import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { ValidationService } from '../../services/config/config.service';
import { UserService } from '../../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../services/config/config.service';
import { User } from '../../services/user/user';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	animations: [routerTransition()],
	host: { '[@routerTransition]': '' }
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	private rec: User
	constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService) {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, ValidationService.emailValidator]],
			password: ['', [
				Validators.required,
				Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
			   ]]
		});
	}

	// Check if user already logged in
	ngOnInit() {
		if (localStorage.getItem('userData')) {
			this.router.navigate(['/']);
		}
	}

	// Initicate login
	doLogin() {
		this.userService.doLogin().subscribe(r => {
			this.rec = r as User;
			console.log('this.rec',this.rec);	
			const login = this.userService.checkLogin(this.loginForm.value, this.rec);	
			this.success(login);	
		  })
		

		// const login = this.userService.doLogin(this.loginForm.value);
		// console.log('login',login)
		// if(login != null){
		// 	console.log('call success fun');
		// 	this.success(login);
		// }		
	}

	// Login success function
	success(data) {
		console.log('redirection')
		if (data.code === 200) {
			localStorage.setItem('userData', JSON.stringify(data.data));
			this.router.navigate(['/dashboard']);
			this.toastr.success('Success', 'Logged In Successfully');
		} else {
			this.toastr.error('Failed', 'Invalid Credentials');
		}
	}

}

    /**
 * Created By : Vijeta Rathod
 */
