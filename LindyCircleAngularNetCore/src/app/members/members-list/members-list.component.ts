import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { LoadingComponent } from '@app-shared/loading/loading.component';
import { OkDialogComponent } from '@app-shared/ok-dialog/ok-dialog.component';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { RepositoryService } from '@app-shared/services/repository.service';
import { SortingService } from '@app-shared/services/sorting.service';
import { Member } from 'app/members/models/member.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-members-list',
	templateUrl: './members-list.component.html',
	styleUrls: ['./members-list.component.css']
})

export class MembersListComponent implements OnInit {
	isUserAdmin: boolean = this.authService.isUserAdmin();

	modalRef?: BsModalRef;
	modalTitle: string;

	members: Member[];
	membersWithoutFilter: Member[];

	firstNameFilter: string = "";
	lastNameFilter: string = "";
	activeFilter: boolean = true;

	firstNameSort: boolean = true;
	lastNameSort: boolean = true;
	totalPaidSort: boolean = true;
	attendanceSort: boolean = true;

	deleteId: number;

	constructor(private modalService: BsModalService,
		private repository: RepositoryService,
		private sorter: SortingService,
		private authService: AuthenticationService) { }

	ngOnInit(): void {
		this.getMembers();
	}

	getMembers(): void {
		this.modalRef = this.modalService.show(LoadingComponent)
		this.repository.getMembers().subscribe(
			(res: Member[]) => {
				this.members = res;
				this.membersWithoutFilter = res;
				this.filterMembers();
			},
			() => {
				this.modalRef.hide();
			},
			() => {
				this.modalRef.hide();
			});
	}

	filterMembers(): void {
		var firstNameFilter = this.firstNameFilter;
		var lastNameFilter = this.lastNameFilter;
		var activeFilter = this.activeFilter;

		this.members = this.membersWithoutFilter.filter(
			function (member: Member) {
				return member.firstName.toString().toLowerCase().includes(
					firstNameFilter.toString().trim().toLowerCase()) &&
					member.lastName.toString().toLowerCase().includes(
						lastNameFilter.toString().trim().toLowerCase()) &&
					(member.inactive == false || member.inactive != activeFilter);
			}
		);
	}

	sortResult(col: string, sort: string): void {
		var asc = Reflect.get(this, sort);
		Reflect.set(this, sort, !asc);
		this.members = this.sorter.sort(this.members, col, asc);
	}

	confirmDelete(member: Member): void {
		this.deleteId = member.memberId;
		const initialState: ModalOptions = {
			initialState: {
				titleText: "WARNING! This action cannot be undone.",
				bodyText: `Are you sure you want to delete ${member.firstLastName}?`,
				falseButtonText: 'Cancel',
				trueButtonText: 'Delete',
				trueButtonClass: 'btn btn-danger'
			}
		};
		this.modalRef = this.modalService.show(ConfirmationDialogComponent, initialState);
		this.modalRef.content.event.subscribe((res: any) => {
			if (res) this.deleteMember();
		});
	}

	deleteMember(): void {
		this.repository.deleteMember(this.deleteId).subscribe(
			_ => {
				this.showOkModal("Success", "Member deleted.");
				this.getMembers();
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
