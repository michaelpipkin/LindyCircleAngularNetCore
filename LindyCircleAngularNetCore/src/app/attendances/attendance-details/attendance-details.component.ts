import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { LoadingComponent } from '@app-shared/loading/loading.component';
import { OkDialogComponent } from '@app-shared/ok-dialog/ok-dialog.component';
import { DateFormatService } from '@app-shared/services/date-format.service';
import { RepositoryService } from '@app-shared/services/repository.service';
import { SortingService } from '@app-shared/services/sorting.service';
import { Attendance } from 'app/attendances/models/attendance.model';
import { Defaults } from 'app/attendances/services/attendance-defaults-resolver.service';
import { Member } from 'app/members/models/member.model';
import { Practice } from 'app/practices/models/practice.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-attendance-details',
	templateUrl: './attendance-details.component.html',
	styleUrls: ['./attendance-details.component.css']
})

export class AttendanceDetailsComponent implements OnInit {

	constructor(
		private modalService: BsModalService,
		private repository: RepositoryService,
		private formBuilder: FormBuilder,
		private dateFormatService: DateFormatService,
		private sorter: SortingService,
		private route: ActivatedRoute) { }

	modalRef?: BsModalRef;
	modalTitle: string = "";

	members: Member[] = [];
	attendances: Attendance[] = [];
	defaultRentalCost: number = 0;
	nextPracticeNumber: number = 0;
	practice: Practice | undefined;

	practiceForm = this.formBuilder.group({
		practiceId: 0,
		practiceNumber: 0,
		practiceDate: [new Date(), Validators.required],
		practiceTopic: ['', Validators.required],
		practiceCost: [0, [Validators.required, Validators.min(0)]],
		miscExpense: [0, [Validators.required, Validators.min(0)]],
		miscRevenue: [0, [Validators.required, Validators.min(0)]]
	});

	attendanceForm = this.formBuilder.group({
		memberId: 0,
		paymentType: [0, Validators.required],
		paymentAmount: [0, [Validators.required, Validators.min(0)]]
	})

	deleteId: number = 0;

	ngOnInit(): void {
		this.route.data.subscribe(data => {
			const defaults: Defaults = data['defaults'];
			this.nextPracticeNumber = defaults.practiceNumber;
			this.defaultRentalCost = defaults.rentalCost;
		});
		this.practiceForm.patchValue({
			'practiceDate': this.dateFormatService.formatDate(new Date()),
		})
		this.onDateChange();
	}

	getNextPracticeNumber(): void {
		this.repository.getNextPracticeNumber().subscribe(
			res => {
				this.nextPracticeNumber = res;
			},
		);
	}

	getDefaultRentalCost(): void {
		this.repository.getDefaultValue('Rental cost').subscribe(
			res => {
				this.defaultRentalCost = res;
			}
		);
	}

	onDateChange(): void {
		const modalRef = this.modalService.show(LoadingComponent);
		var practiceDate = this.practiceForm.value.practiceDate;
		this.repository.getPracticeByDate(practiceDate).subscribe(
			res => {
				if (res != null) {
					this.practice = res;
					this.practiceForm.patchValue({
						'practiceId': this.practice.practiceId,
						'practiceNumber': this.practice.practiceNumber,
						'practiceTopic': this.practice.practiceTopic,
						'practiceCost': this.practice.practiceCost,
						'miscExpense': this.practice.miscExpense,
						'miscRevenue': this.practice.miscRevenue
					})
				}
				else {
					this.practiceForm.patchValue({
						'practiceId': 0,
						'practiceNumber': this.nextPracticeNumber,
						'practiceTopic': '',
						'practiceCost': this.defaultRentalCost,
						'miscExpense': 0,
						'miscRevenue': 0
					})
				}
				setTimeout(() => { modalRef.hide() }, 500);
			});
	}

	confirmDelete(practice: Practice): void {
		this.deleteId = practice.practiceId;
		const initialState: ModalOptions = {
			initialState: {
				modalTitle: "WARNING! This action cannot be undone.",
				modalBody: `Are you sure you want to delete practice #${practice.practiceNumber} on ${practice.practiceDateString}?`
			}
		};
		this.modalRef = this.modalService.show(ConfirmationDialogComponent, initialState);
		this.modalRef.content.event.subscribe((res: any) => {
			if (res) this.deletePractice();
		});
	}

	deletePractice(): void {
		this.repository.deletePractice(this.deleteId).subscribe(
			_ => {
				this.showOkModal("Success", "Practice deleted.");
			}
		);
	}

	validateControl = (controlName: string): boolean =>
		this.practiceForm.controls[controlName].invalid && this.practiceForm.controls[controlName].touched;

	hasError = (controlName: string, errorName: string): boolean => this.practiceForm.controls[controlName].hasError(errorName);

	onPracticeFormSubmit(): void {
		if (this.practiceForm.value.practiceId == 0) {
			this.repository.addPractice(this.practiceForm.value).subscribe(
				res => {
					this.closePracticeForm();
					this.getNextPracticeNumber();
					this.showOkModal("Success", `Practice #${res.practiceNumber} on ${res.practiceDateString} added.`);
				}
			);
		}
		else {
			this.repository.updatePractice(this.practiceForm.value).subscribe(
				res => {
					this.closePracticeForm();
					this.showOkModal("Success", `Practice #${res.practiceNumber} updated.`);
				}
			);
		}
	}

	closePracticeForm() {
		this.practiceForm.reset();
		this.modalRef?.hide();
	}

	onAttendanceFormSubmit(): void {

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
