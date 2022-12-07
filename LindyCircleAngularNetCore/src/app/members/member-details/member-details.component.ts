import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '@app-shared/services/repository.service';
import { Attendance } from 'app/attendances/models/attendance.model';
import { Member } from 'app/members/models/member.model';
import { PunchCard } from 'app/punch-cards/models/punch-card.model';

@Component({
	selector: 'app-member-details',
	templateUrl: './member-details.component.html',
	styleUrls: ['./member-details.component.css']
})

export class MemberDetailsComponent implements OnInit {
	member: Member;
	attendances: Attendance[];
	totalAttendanceAmount: number;
	punchCards: PunchCard[];
	totalPurchaseAmount: number;

	constructor(private http: HttpClient,
		private route: ActivatedRoute,
		private repository: RepositoryService) { }

	ngOnInit(): void {
		// + casts the param as a number
		const memberId: number = +this.route.snapshot.params['memberId'];

		this.repository.getMember(memberId).subscribe(
			res => {
				this.member = res;
			});

		this.repository.getAttendanceForMember(memberId).subscribe(
			res => {
				this.attendances = res;
				this.totalAttendanceAmount = res.reduce(
					(runningTotal, attendance) => runningTotal + attendance.paymentAmount, 0
				);
			});

		this.repository.getPunchCardsPurchasedByMember(memberId).subscribe(
			res => {
				this.punchCards = res;
				this.totalPurchaseAmount = res.reduce(
					(runningTotal, punchCard) => runningTotal + punchCard.purchaseAmount, 0
				);
			});
	}
}
