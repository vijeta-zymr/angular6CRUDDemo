    /**
 * Created By : Vijeta Rathod
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class UserdataService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/profile';
  // Get all Users list via API or any data storage
  // getAllUsers() {
  //   let UserList: any;
  //   if (localStorage.getItem('Users') && localStorage.getItem('Users') !== '') {
  //     UserList = {
  //       code: 200,
  //       message: 'Users List Fetched Successfully',
  //       data: JSON.parse(localStorage.getItem('Users'))
  //     };
  //   } else {
  //     UserList = {
  //       code: 200,
  //       message: 'Users List Fetched Successfully',
  //       data: JSON.parse(localStorage.getItem('Users'))
  //     };
  //   }
  //   return UserList;
  // }
  getAllUsersByApi(): Observable<any> {
    return this.http.get<any>(this.apiUrl)
  }
  doRegisterUser(index) {
    const UserList = JSON.parse(localStorage.getItem('Users'));
    let returnData;
    console.log('index', index);
    if (index != null) {
      // for (let i = 0; i < UserList.length; i++) {
      //   if (index !== i && UserList[i].email === data.email) {
      //     returnData = {
      //       code: 503,
      //       message: 'Email Address Already In Use',
      //       data: null
      //     };
      //     return returnData;
      //   }
      // }

      UserList[index] = index;
      localStorage.setItem('Users', JSON.stringify(UserList));
      console.log('local storage UserList',UserList);
      returnData = {
        code: 200,
        message: 'User Successfully Updated',
        data: JSON.parse(localStorage.getItem('Users'))
      };
    } 
    return returnData;
  }
  doRegister(data): Observable<any> {
      console.log('add data',data)
			return this.http.post(this.apiUrl,data);	
    }
  deleteUser(index: number) {
    const UserList = JSON.parse(localStorage.getItem('Users'));

    UserList.splice(index, 1);

    localStorage.setItem('Users', JSON.stringify(UserList));

    const returnData = {
      code: 200,
      message: 'User Successfully Deleted',
      data: JSON.parse(localStorage.getItem('Users'))
    };

    return returnData;
  }



  getUserDetails(index: number): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/'+index)

    // const UserList = JSON.parse(localStorage.getItem('Users'));

    // const returnData = {
    //   code: 200,
    //   message: 'User Details Fetched',
    //   UserData: UserList[index]
    // };

    // return returnData;
  }


  generateRandomID() {
    const x = Math.floor((Math.random() * Math.random() * 9999));
    return x;
  }

}
    /**
 * Created By : Vijeta Rathod
 */
