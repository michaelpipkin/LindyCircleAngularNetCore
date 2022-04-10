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

    constructor(private http: HttpClient,
        private route: ActivatedRoute,
        private repository: RepositoryService) { }

    member: Member | undefined;
    attendances: Attendance[] = [];
    totalAttendanceAmount: number = 0;
    punchCards: PunchCard[] = [];
    totalPurchaseAmount: number = 0;

    ngOnInit(): void {
        const routeParams = this.route.snapshot.paramMap;
        const memberIdFromRoute = Number(routeParams.get('memberId'));

        this.repository.getMember(memberIdFromRoute).subscribe(data => {
            this.member = data;
        });

        this.repository.getAttendanceForMember(memberIdFromRoute).subscribe(data => {
            this.attendances = data;
            this.totalAttendanceAmount = data.reduce(
                (runningTotal, attendance) => runningTotal + attendance.paymentAmount, 0
            );
        });

        this.repository.getPunchCardsPurchasedByMember(memberIdFromRoute).subscribe(data => {
            this.punchCards = data;
            this.totalPurchaseAmount = data.reduce(
                (runningTotal, punchCard) => runningTotal + punchCard.purchaseAmount, 0
            );
        });
    }
}
