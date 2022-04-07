import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { ErrorNotificationComponent } from '@app-shared/error-notification/error-notification.component';
import { OkDialogComponent } from '@app-shared/ok-dialog/ok-dialog.component';
import { ErrorHandlerService } from '@app-shared/services/error-handler.service';
import { YesnoDialogComponent } from '@app-shared/yesno-dialog/yesno-dialog.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from 'app/app-routing.module';
import { AppComponent } from 'app/app.component';
import { NavbarComponent } from 'app/core/components/navbar/navbar.component';
import { HomeComponent } from 'app/home/home.component';
import { MemberDetailsComponent } from 'app/members/member-details/member-details.component';
import { MembersListComponent } from 'app/members/members-list/members-list.component';
import { PracticesListComponent } from 'app/practices/practices-list/practices-list.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule, MODAL_CONFIG_DEFAULT_OVERRIDE } from 'ngx-bootstrap/modal';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		MembersListComponent,
		NavbarComponent,
		ConfirmationDialogComponent,
		YesnoDialogComponent,
		MemberDetailsComponent,
		OkDialogComponent,
		ErrorNotificationComponent,
		PracticesListComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		ModalModule.forRoot(),
		TooltipModule.forRoot(),
		BsDatepickerModule.forRoot(),
		BsDropdownModule.forRoot(),
		JwtModule.forRoot({
			config: {
				tokenGetter: () => {
					return localStorage.getItem("token");
				},
				allowedDomains: ["localhost:7140"],
				disallowedRoutes: []
			}
		})
	],
	providers: [
		{ provide: MODAL_CONFIG_DEFAULT_OVERRIDE, useValue: { class: 'modal-dialog-centered' } },
		{ provide: TooltipConfig, useValue: { container: 'body', placement: 'top', adaptivePosition: false } },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerService, multi: true }
	],
	bootstrap: [AppComponent]
})

export class AppModule { }
