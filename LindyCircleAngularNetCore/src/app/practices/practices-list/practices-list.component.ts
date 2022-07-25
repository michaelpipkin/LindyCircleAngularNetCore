import { Component, OnInit, TemplateRef } from '@angular/core';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { LoadingComponent } from '@app-shared/loading/loading.component';
import { OkDialogComponent } from '@app-shared/ok-dialog/ok-dialog.component';
import { AuthenticationService } from '@app-shared/services/authentication.service';
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
		private authService: AuthenticationService) { }

	isUserAdmin: boolean = this.authService.isUserAdmin();

	modalRef?: BsModalRef;
	modalTitle: string = "";

	practices: Practice[] = [];
	practicesWithoutFilter: Practice[] = [];
	defaultRentalCost: number = 0;
	nextPracticeNumber: number = 0;

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
