import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@app-shared/guards/admin.guard';
import { AuthGuard } from '@app-shared/guards/auth.guard';
import { AttendanceDetailsComponent } from 'app/attendances/attendance-details/attendance-details.component';
import { HomeComponent } from 'app/home/home.component';
import { MemberDetailsComponent } from 'app/members/member-details/member-details.component';
import { MembersListComponent } from 'app/members/members-list/members-list.component';
import { PracticeDetailsComponent } from 'app/practices/practice-details/practice-details.component';
import { PracticesListComponent } from 'app/practices/practices-list/practices-list.component';
import { PunchCardsComponent } from 'app/punch-cards/punch-cards/punch-cards.component';
import { AddMemberComponent } from './members/add-member/add-member.component';
import { EditMemberComponent } from './members/edit-member/edit-member.component';
import { MembersComponent } from './members/members/members.component';
import { AddPracticeComponent } from './practices/add-practice/add-practice.component';
import { EditPracticeComponent } from './practices/edit-practice/edit-practice.component';
import { PracticesComponent } from './practices/practices/practices.component';
import { PunchCardListComponent } from './punch-cards/punch-card-list/punch-card-list.component';
import { DefaultsResolverService } from './shared/services/defaults-resolver.service';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		component: HomeComponent,
		data: { title: 'Home' }
	},
	{
		path: 'members',
		component: MembersComponent,
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		children: [
			{
				path: '',
				component: MembersListComponent,
				data: { title: 'Members' }
			},
			{
				path: 'add',
				component: AddMemberComponent,
				canActivate: [AdminGuard],
				data: { title: 'Add Member' }
			},
			{
				path: ':memberId/edit',
				component: EditMemberComponent,
				canActivate: [AdminGuard],
				data: { title: 'Edit Member' }
			},
			{
				path: ':memberId',
				component: MemberDetailsComponent,
				canActivate: [AdminGuard],
				data: { title: 'Member Details' }
			}
		]
	},
	{
		path: 'practices',
		component: PracticesComponent,
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		children: [
			{
				path: '',
				component: PracticesListComponent,
				data: { title: 'Practices' }
			},
			{
				path: 'add',
				component: AddPracticeComponent,
				canActivate: [AdminGuard],
				data: { title: 'Add Practice' }
			},
			{
				path: ':practiceId/edit',
				component: EditPracticeComponent,
				canActivate: [AdminGuard],
				data: { title: 'Edit Practice' }
			},
			{
				path: ':practiceId',
				component: PracticeDetailsComponent,
				canActivate: [AdminGuard],
				data: { title: 'Practice Details' }
			}
		]
	},
	{
		path: 'punchcards',
		component: PunchCardsComponent,
		canActivate: [AuthGuard, AdminGuard],
		canActivateChild: [AuthGuard, AdminGuard],
		children: [
			{
				path: '',
				component: PunchCardListComponent,
				data: { title: 'Punch Cards' },
				resolve: { defaults: DefaultsResolverService },
			}
		]
	},
	{
		path: 'attendance',
		component: AttendanceDetailsComponent,
		canActivate: [AuthGuard, AdminGuard],
		data: { title: 'Attendance' },
		resolve: { defaults: DefaultsResolverService }
	},
	{
		path: 'account',
		loadChildren: () => import('app/authentication/authentication.module').then(m => m.AuthenticationModule)
	},
	{
		path: '**',
		redirectTo: 'home'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule],
})

export class AppRoutingModule { }
