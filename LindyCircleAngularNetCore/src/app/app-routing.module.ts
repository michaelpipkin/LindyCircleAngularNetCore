import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@app-shared/guards/admin.guard';
import { AuthGuard } from '@app-shared/guards/auth.guard';
import { AttendanceDetailsComponent } from 'app/attendances/attendance-details/attendance-details.component';
import { AttendanceDefaultsResolverService } from 'app/attendances/services/attendance-defaults-resolver.service';
import { HomeComponent } from 'app/home/home.component';
import { MemberDetailsComponent } from 'app/members/member-details/member-details.component';
import { MembersListComponent } from 'app/members/members-list/members-list.component';
import { PracticeDetailsComponent } from 'app/practices/practice-details/practice-details.component';
import { PracticesListComponent } from 'app/practices/practices-list/practices-list.component';
import { PunchCardsComponent } from 'app/punch-cards/punch-cards/punch-cards.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		data: { title: 'Home' }
	},
	{
		path: 'members',
		component: MembersListComponent,
		canActivate: [AuthGuard],
		data: { title: 'Members' }
	},
	{
		path: 'members/:memberId',
		component: MemberDetailsComponent,
		canActivate: [AuthGuard, AdminGuard],
		data: { title: 'Member Details' }
	},
	{
		path: 'practices',
		component: PracticesListComponent,
		canActivate: [AuthGuard],
		data: { title: 'Practices' }
	},
	{
		path: 'practices/:practiceId',
		component: PracticeDetailsComponent,
		canActivate: [AuthGuard, AdminGuard],
		data: { title: 'Practice Details' }
	},
	{
		path: 'punchcards',
		component: PunchCardsComponent,
		canActivate: [AuthGuard, AdminGuard],
		data: { title: 'Punch Cards' }
	},
	{
		path: 'attendance',
		component: AttendanceDetailsComponent,
		canActivate: [AuthGuard, AdminGuard],
		data: { title: 'Attendance' },
		resolve: { defaults: AttendanceDefaultsResolverService }
	},
	{
		path: 'account',
		loadChildren: () => import('app/authentication/authentication.module').then(m => m.AuthenticationModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})

export class AppRoutingModule { }
