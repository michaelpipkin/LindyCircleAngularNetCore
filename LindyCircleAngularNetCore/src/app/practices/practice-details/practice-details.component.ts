import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { OkDialogComponent } from '@app-shared/ok-dialog/ok-dialog.component';
import { RepositoryService } from '@app-shared/services/repository.service';
import { Attendance } from 'app/attendances/models/attendance.model';
import { Practice } from 'app/practices/models/practice.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-practice-details',
	templateUrl: './practice-details.component.html',
	styleUrls: ['./practice-details.component.css']
})

export class PracticeDetailsComponent implements OnInit {
	practice: Practice;
	attendances: Attendance[];
	totalAttendanceAmount: number;

	modalRef?: BsModalRef;

	constructor(private http: HttpClient,
		private route: ActivatedRoute,
		private repository: RepositoryService,
		private modalService: BsModalService	) { }

	ngOnInit(): void {
		// + casts the param as a number
		const practiceId: number = +this.route.snapshot.params['practiceId'];

		this.repository.getPractice(practiceId).subscribe(
			res => {
				this.practice = res;
			});

		this.repository.getAttendanceForPractice(practiceId).subscribe(
			res => {
				this.attendances = res;
				this.totalAttendanceAmount = res.reduce(
					(runningTotal, attendance) => runningTotal + attendance.paymentAmount, 0
				);
			});
	}

	onDelete(): void {
		const initialState: ModalOptions = {
			initialState: {
				titleText: "WARNING! This action cannot be undone.",
				bodyText: `Are you sure you want to delete practice #${this.practice.practiceNumber} on ${this.practice.practiceDateString}?`,
				falseButtonText: 'Cancel',
				trueButtonText: 'Delete',
				trueButtonType: 'danger'
			}
		};
		this.modalRef = this.modalService.show(ConfirmationDialogComponent, initialState);
		this.modalRef.content.event.subscribe((res: any) => {
			if (res) this.deletePractice();
		});
	}

	deletePractice(): void {
		this.repository.deletePractice(this.practice.practiceId).subscribe(
			_ => {
				this.showOkModal("Success", "Practice deleted.");
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
