import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
	declarations: [
		RegisterUserComponent,
		LoginComponent,
		UserProfileComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		EmailConfirmationComponent
	],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
			{ path: 'register', component: RegisterUserComponent, data: { title: 'Register' } },
			{ path: 'login', component: LoginComponent, data: { title: 'Login' } },
			{ path: 'profile', component: UserProfileComponent, data: { title: 'Profile' } },
			{ path: 'forgotpassword', component: ForgotPasswordComponent, data: { title: 'Forgot Password' } },
			{ path: 'resetpassword', component: ResetPasswordComponent, data: { title: 'Reset Password' } },
			{ path: 'emailconfirmation', component: EmailConfirmationComponent, data: { title: 'Confirm Email' } }
        ])
	],
	providers: [Title]
})

export class AuthenticationModule { }
