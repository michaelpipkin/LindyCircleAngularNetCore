import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { OkDialogComponent } from '@app-shared/ok-dialog/ok-dialog.component';
import { RepositoryService } from '@app-shared/services/repository.service';
import { Attendance } from 'app/attendances/models/attendance.model';
import { Member } from 'app/members/models/member.model';
import { PunchCard } from 'app/punch-cards/models/punch-card.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

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

	modalRef?: BsModalRef;

	constructor(private route: ActivatedRoute,
		private repository: RepositoryService,
		private modalService: BsModalService,
		private router: Router	) { }

	ngOnInit(): void {
		// + casts the param as a number
		const memberId: number = +this.route.snapshot.params['memberId'];

		this.repository.getMember(memberId).subscribe(
			(res: Member) => {
				this.member = res;
			});

		this.repository.getAttendanceForMember(memberId).subscribe(
			(res: Attendance[]) => {
				this.attendances = res;
				this.totalAttendanceAmount = res.reduce(
					(runningTotal, attendance) => runningTotal + attendance.paymentAmount, 0
				);
			});

		this.repository.getPunchCardsPurchasedByMember(memberId).subscribe(
			(res: PunchCard[]) => {
				this.punchCards = res;
				this.totalPurchaseAmount = res.reduce(
					(runningTotal, punchCard) => runningTotal + punchCard.purchaseAmount, 0
				);
			});
	}

	onDelete(): void {
		const initialState: ModalOptions = {
			initialState: {
				titleText: "WARNING! This action cannot be undone.",
				bodyText: `Are you sure you want to delete ${this.member.firstLastName}?`,
				falseButtonText: 'Cancel',
				trueButtonText: 'Delete',
				trueButtonType: 'danger',
			}
		};
		this.modalRef = this.modalService.show(ConfirmationDialogComponent, initialState);
		this.modalRef.content.event.subscribe((res: any) => {
			if (res) this.deleteMember();
		});
	}

	deleteMember(): void {
		this.repository.deleteMember(this.member.memberId).subscribe(
			() => {
				this.showOkModal("Success", "Member deleted.");
			},
			() => { },
			() => {
				this.router.navigate(["/members"]);
			}
		);
	}

	showOkModal(title: string, body: string = ""): void {
		const initialState: ModalOptions = {
			initialState: {
				modalTitle: title,
				modalBody: body
			}
		};
		this.modalRef = this.modalService.show(OkDialogComponent, initialState);
	}
}
