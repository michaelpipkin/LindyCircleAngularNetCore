import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { OkDialogComponent } from '@app-shared/ok-dialog/ok-dialog.component';
import { Member } from 'app/members/models/member.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { RepositoryService } from '@app-shared/services/repository.service';
import { TableSortService } from '@app-shared/services/table-sort.service';

@Component({
	selector: 'app-members-list',
	templateUrl: './members-list.component.html',
	styleUrls: ['./members-list.component.css']
})

export class MembersListComponent implements OnInit {

	constructor(private modalService: BsModalService,
		private repository: RepositoryService,
		private sorter: TableSortService,
		private formBuilder: FormBuilder,
		private authService: AuthenticationService) { }

	isUserAdmin: boolean = this.authService.isUserAdmin();

	modalRef?: BsModalRef;
	modalTitle: string = "";

	members: Member[] = [];
	membersWithoutFilter: Member[] = [];

	memberForm = this.formBuilder.group({
		memberId: 0,
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		inactive: false
	});

	firstNameFilter: string = "";
	lastNameFilter: string = "";
	activeFilter: boolean = true;

	firstNameSort: boolean = true;
	lastNameSort: boolean = true;
	totalPaidSort: boolean = true;
	attendanceSort: boolean = true;

	deleteId: number = 0;

	ngOnInit(): void {
		this.getMembers();
	}

	getMembers() {
		this.repository.getMembers().subscribe(data => {
			this.members = data;
			this.membersWithoutFilter = data;
			this.filterMembers();
		});
	}

	filterMembers() {
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

	sortResult(col: string, sort: string) {
		var asc = Reflect.get(this, sort);
		Reflect.set(this, sort, !asc);
		this.members = this.sorter.sort(this.members, col, asc);
	}

	addClick(memberModal: TemplateRef<any>) {
		this.memberForm.setValue({
			'memberId': 0,
			'firstName': '',
			'lastName': '',
			'inactive': false
		});
		this.modalTitle = "Add Member";
		this.modalRef = this.modalService.show(memberModal);
	}

	editClick(member: Member, memberModal: TemplateRef<any>) {
		this.memberForm.setValue({
			'memberId': member.memberId,
			'firstName': member.firstName,
			'lastName': member.lastName,
			'inactive': member.inactive
		});
		this.modalTitle = "Edit Member";
		this.modalRef = this.modalService.show(memberModal);
	}

	validateControl = (controlName: string) =>
		this.memberForm.controls[controlName].invalid && this.memberForm.controls[controlName].touched;


	hasError = (controlName: string, errorName: string) => this.memberForm.controls[controlName].hasError(errorName);

	onMemberFormSubmit() {
		if (this.memberForm.value.memberId == 0) {
			this.repository.addMember(this.memberForm.value).subscribe(
				res => {
					this.closeMemberForm();
					this.getMembers();
					this.showOkModal("Success", `${res.firstLastName} added.`);
				}
			);
		}
		else {
			this.repository.updateMember(this.memberForm.value).subscribe(
				res => {
					this.closeMemberForm();
					this.getMembers();
					this.showOkModal("Success", `${res.firstLastName} updated.`);
				}
			);
		}
	}

	closeMemberForm() {
		this.memberForm.reset();
		this.modalRef?.hide();
	}

	confirmDelete(member: Member) {
		this.deleteId = member.memberId;
		const initialState: ModalOptions = {
			initialState: {
				modalTitle: "WARNING! This action cannot be undone.",
				modalBody: `Are you sure you want to delete ${member.firstLastName}?`
			}
		};
		this.modalRef = this.modalService.show(ConfirmationDialogComponent, initialState);
		this.modalRef.content.event.subscribe((res: any) => {
			if (res) this.deleteMember();
		});
	}

	deleteMember() {
		this.repository.deleteMember(this.deleteId).subscribe(
			_ => {
				this.showOkModal("Success", "Member deleted.");
				this.getMembers();
			}
		);
	}

	showOkModal(title: string, body: string = "") {
		const initialState: ModalOptions = {
			initialState: {
				modalTitle: title,
				modalBody: body
			}
		};
		this.modalRef = this.modalService.show(OkDialogComponent, initialState);
	}
}
