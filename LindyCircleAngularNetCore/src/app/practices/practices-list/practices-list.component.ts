import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { LoadingComponent } from '@app-shared/loading/loading.component';
import { OkDialogComponent } from '@app-shared/ok-dialog/ok-dialog.component';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { DateFormatService } from '@app-shared/services/date-format.service';
import { RepositoryService } from '@app-shared/services/repository.service';
import { SortingService } from '@app-shared/services/sorting.service';
import { Practice } from 'app/practices/models/practice.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-practices-list',
	templateUrl: './practices-list.component.html',
	styleUrls: ['./practices-list.component.css']
})

export class PracticesListComponent implements OnInit {

	constructor(private modalService: BsModalService,
		private repository: RepositoryService,
		private sorter: SortingService,
		private formBuilder: FormBuilder,
		private authService: AuthenticationService,
		private dateFormatService: DateFormatService) { }

	isUserAdmin: boolean = this.authService.isUserAdmin();

	modalRef?: BsModalRef;
	modalTitle: string = "";

	practices: Practice[] = [];
	practicesWithoutFilter: Practice[] = [];
	defaultRentalCost: number = 0;
	nextPracticeNumber: number = 0;

	practiceForm = this.formBuilder.group({
		practiceId: 0,
		practiceNumber: 0,
		practiceDate: [new Date(), Validators.required],
		practiceTopic: ['', Validators.required],
		practiceCost: [0, [Validators.required, Validators.min(0)]],
		miscExpense: [0, [Validators.required, Validators.min(0)]],
		miscRevenue: [0, [Validators.required, Validators.min(0)]]
	});

	practiceTopicFilter: string = "";
	startDateFilter: Date | undefined;
	endDateFilter: Date | undefined;

	numberSort: boolean = false;
	dateSort: boolean = false;
	attendanceSort: boolean = true;
	practiceCostSort: boolean = true;
	attendanceRevenueSort: boolean = true;
	miscExpenseSort: boolean = true;
	miscRevenueSort: boolean = true;

	deleteId: number = 0;

	ngOnInit(): void {
		this.getNextPracticeNumber();
		this.getDefaultRentalCost();
		this.getPractices();
	}

	getPractices(): void {
		const modalRef = this.modalService.show(LoadingComponent);
		this.repository.getPractices().subscribe(
			res => {
				this.practices = res;
				this.practicesWithoutFilter = res;
				this.filterPractices;
				setTimeout(() => { modalRef.hide() }, 500);
			});
	}

	getNextPracticeNumber(): void {
		this.repository.getNextPracticeNumber().subscribe(
			res => {
				this.nextPracticeNumber = res;
			}
		);
	}

	getDefaultRentalCost(): void {
		this.repository.getDefaultValue('Rental cost').subscribe(
			res => {
				this.defaultRentalCost = res;
			}
		);
	}

	filterPractices(): void {
		var topicFilter = this.practiceTopicFilter;
		var startDateFilter = this.startDateFilter;
		var endDateFilter = this.endDateFilter;

		this.practices = this.practicesWithoutFilter.filter(
			function (practice: Practice) {
				return practice.practiceTopic.toString().toLowerCase().includes(
					topicFilter.toString().trim().toLowerCase()) &&
					(startDateFilter != undefined && startDateFilter.toString() != '' ?
						practice.practiceDate >= startDateFilter : true) &&
					(endDateFilter != undefined && endDateFilter.toString() != '' ?
						practice.practiceDate <= endDateFilter : true)
			}
		);
	}

	sortResult(col: string, sort: string): void {
		var asc = Reflect.get(this, sort);
		Reflect.set(this, sort, !asc);
		this.practices = this.sorter.sort(this.practices, col, asc);
	}

	addClick(practiceModal: TemplateRef<any>): void {
		this.practiceForm.setValue({
			'practiceId': 0,
			'practiceNumber': this.nextPracticeNumber,
			'practiceDate': this.dateFormatService.formatDate(new Date()),
			'practiceTopic': '',
			'practiceCost': this.defaultRentalCost,
			'miscExpense': 0,
			'miscRevenue': 0
		});
		this.modalTitle = 'Add Practice';
		this.modalRef = this.modalService.show(practiceModal);
	}

	editClick(practice: Practice, practiceModal: TemplateRef<any>): void {
		this.practiceForm.setValue({
			'practiceId': practice.practiceId,
			'practiceNumber': practice.practiceNumber,
			'practiceDate': practice.practiceDateString,
			'practiceTopic': practice.practiceTopic,
			'practiceCost': practice.practiceCost,
			'miscExpense': practice.miscExpense,
			'miscRevenue': practice.miscRevenue
		});
		this.modalTitle = 'Edit Practice';
		this.modalRef = this.modalService.show(practiceModal);
	}

	validateControl = (controlName: string): boolean =>
		this.practiceForm.controls[controlName].invalid && this.practiceForm.controls[controlName].touched;

	hasError = (controlName: string, errorName: string): boolean => this.practiceForm.controls[controlName].hasError(errorName);

	onPracticeFormSubmit(): void {
		if (this.practiceForm.value.practiceId == 0) {
			this.repository.addPractice(this.practiceForm.value).subscribe(
				res => {
					this.closePracticeForm();
					this.getPractices();
					this.getNextPracticeNumber();
					this.showOkModal("Success", `Practice #${res.practiceNumber} on ${res.practiceDateString} added.`);
				}
			);
		}
		else {
			this.repository.updatePractice(this.practiceForm.value).subscribe(
				res => {
					this.closePracticeForm();
					this.getPractices();
					this.showOkModal("Success", `Practice #${res.practiceNumber} updated.`);
				}
			);
		}
	}

	closePracticeForm(): void {
		this.practiceForm.reset();
		this.modalRef?.hide();
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
				this.getPractices();
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
