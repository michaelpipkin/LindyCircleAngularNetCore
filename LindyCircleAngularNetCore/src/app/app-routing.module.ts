import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@app-shared/guards/admin.guard';
import { AuthGuard } from '@app-shared/guards/auth.guard';
import { EmailConfirmationComponent } from 'app/authentication/email-confirmation/email-confirmation.component';
import { ForgotPasswordComponent } from 'app/authentication/forgot-password/forgot-password.component';
import { LoginComponent } from 'app/authentication/login/login.component';
import { RegisterUserComponent } from 'app/authentication/register-user/register-user.component';
import { ResetPasswordComponent } from 'app/authentication/reset-password/reset-password.component';
import { UserProfileComponent } from 'app/authentication/user-profile/user-profile.component';
import { HomeComponent } from 'app/home/home.component';
import { MemberDetailsComponent } from 'app/members/member-details/member-details.component';
import { MembersListComponent } from 'app/members/members-list/members-list.component';
import { PracticesListComponent } from 'app/practices/practices-list/practices-list.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'members', component: MembersListComponent, canActivate: [AuthGuard] },
	{ path: 'members/:memberId', component: MemberDetailsComponent, canActivate: [AuthGuard, AdminGuard] },
	{ path: 'practices', component: PracticesListComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterUserComponent },
    { path: 'emailconfirmation', component: EmailConfirmationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'forgotpassword', component: ForgotPasswordComponent },
    { path: 'resetpassword', component: ResetPasswordComponent },
    { path: 'authentication', loadChildren: () => import('app/authentication/authentication.module').then(m => m.AuthenticationModule) }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})

export class AppRoutingModule { }
