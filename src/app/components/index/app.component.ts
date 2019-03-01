    /**
 * Created By : Vijeta Rathod
 */

import { Component } from '@angular/core';
import '../../modal.less';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})


export class AppComponent {
	title = 'Product Management';

	// Add few students for initial listing
	studentsList = [
	{	
		id : 1,
		first_name : "vijeta",
		last_name : "rathod",
		email : "vijeta@gmail.com",
		phone : 9503733178,
		department : "Science"
	},
	{
		id : 2,
		first_name : "darshna",
		last_name : "joshi",
		email : "darshna@gmail.com",
		phone : 8574889658,
		department : "Commerce"
	},
	{
		id : 3,
		first_name : "chirag",
		last_name : "dubal",
		email : "chirag@gmail.com",
		phone : 7485889658,
		department : "Science"
	},
	{
		id : 4,
		first_name : "viral",
		last_name : "shah",
		email : "viral@gmail.com",
		phone : 9685589748,
		department : "Arts"
	},
	{
		id : 5,
		first_name : "gargi",
		last_name : "vyas",
		email : "gargi@gmail.com",
		phone : 8595856547,
		department : "Engineering"
	}
	];

	constructor() {
		// Save students to localStorage
		localStorage.setItem('students', JSON.stringify(this.studentsList));
	}
}

    /**
 * Created By : Vijeta Rathod
 */
