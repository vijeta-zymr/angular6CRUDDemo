import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { enableProdMode } from '@angular/core';

// Modules
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';
import { HttpConfigInterceptor} from './interceptor/httpconfig.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// Services
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { StudentService } from './services/student/student.service';
import { ProductService } from './services/product/product.service';
import { UserdataService } from './services/userdata/user.service';

// Pipes
import { FilterPipe } from './pipes/filter.pipe';
import { PhonePipe } from './pipes/phone.pipe';
import { OrderByPipe } from './pipes/orderby.pipe';

// Components
import { AppComponent } from './components/index/app.component';
import { StudentListComponent } from './components/student/list/student-list.component';
import { StudentDetailsComponent } from './components/student/details/student-details.component';
import { StudentAddComponent } from './components/student/add/student-add.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent, homeChildRoutes } from './components/home/home.component';
import { HighlightStudentDirective } from './directives/highlight-student.directive';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product/list/product-list.component';
import { ProductDetailsComponent } from './components/product/details/product-details.component';
import { ProductAddComponent } from './components/product/add/product-add.component';
import { CartComponent } from './components/cart/cart.component';


import { UserListComponent } from './components/user/list/user-list.component';
import { UserDetailsComponent } from './components/user/details/user-details.component';
import { UserAddComponent } from './components/user/add/user-add.component';
import { ModalService } from './services/modal/modal.service';
import { ModalComponent } from './components/modal/modal/modal.component';


// import { SocketIoModule, SocketIoConfig } from 'ng6-socket-io';
import { ObservableComponent } from './components/observable/observable/observable.component';
import { LearnrxjsComponent } from './components/learnrxjs/learnrxjs.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
 
// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
	declarations: [
		AppComponent,
		StudentListComponent,
		StudentDetailsComponent,
		StudentAddComponent,
		LoginComponent,
		HomeComponent,
		FilterPipe,
		PhonePipe,
		OrderByPipe,
		HighlightStudentDirective,
		DashboardComponent,
		ProductListComponent,
		ProductDetailsComponent,
		ProductAddComponent,
		CartComponent,
		UserListComponent,
		UserDetailsComponent,
		UserAddComponent,
		ModalComponent,
		ObservableComponent,
		LearnrxjsComponent,
	],
	imports: [
		BrowserModule,
		RouterModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		HttpClientModule,
		NgxDatatableModule,
		// SocketIoModule.forRoot(config),
		ToastrModule.forRoot({
			timeOut: 3000,
			positionClass: 'toast-bottom-right',
			preventDuplicates: true,
		}),
	],
	providers: [
		AuthService, UserService, StudentService, ProductService,UserdataService,ModalService,
		{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})

// enableProdMode();

export class AppModule { }

