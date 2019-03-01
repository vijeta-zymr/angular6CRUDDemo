    /**
 * Created By : Vijeta Rathod
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import {Md5} from 'ts-md5/dist/md5';



@Injectable()
export class UserService {

	constructor(private http: HttpClient) { }
	
	private apiUrl = 'http://localhost:3000/profile';
	private chkcredential: any;

	// doLogin(data): Promise<Hero> {
	// 	const url = `${this.heroesGetByIdUrl}/${hero.id}`;
	// 	return this.http
	// 	  .put(url, JSON.stringify(hero), {headers: this.headers})
	// 	  .toPromise()
	// 	  .then(() => hero)
	// 	  .catch(this.handleError);
	//   }

	doLogin(): Observable<any> {
		return this.http.get<any>(this.apiUrl)
		// return this.userData = this.http.get(this.apiUrl)
		//  .subscribe( (userObservable) => {
		// 			 this.userData = userObservable;
		// 			 this.checkLogin(this.userData);
		// 	     });
		
	}
	checkLogin(data, orgValue) {

		console.log('orgvalue',orgValue);
		console.log('data.email',data.email,'data.password',data.password);

		this.chkcredential = orgValue.filter(t=>t.email == data.email && t.password == data.password)
				
		console.log('this.chkcredential',this.chkcredential);
		if (this.chkcredential.length > 0) {
			console.log('success in service');
			return {
				code : 200,
				message : "Login Successful",
				data : this.chkcredential[0]
			};
		}else{
			console.log('failure in service');
			return {
				code : 503,
				message : "Invalid Credentials",
				data : null
			};
		}
	}
	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	  }
	// doRegister(data){
		// 	return this.http.post('user-add.php',data);	
		// }
	}

    /**
 * Created By : Vijeta Rathod
 */