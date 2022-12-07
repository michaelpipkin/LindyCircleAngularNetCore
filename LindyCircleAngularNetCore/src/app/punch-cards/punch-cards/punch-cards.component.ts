import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { OkDialogComponent } from '@app-shared/ok-dialog/ok-dialog.component';
import { DateFormatService } from '@app-shared/services/date-format.service';
import { RepositoryService } from '@app-shared/services/repository.service';
import { SortingService } from '@app-shared/services/sorting.service';
import { Member } from 'app/members/models/member.model';
import { PunchCard } from 'app/punch-cards/models/punch-card.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
	selector: 'app-punch-cards',
	templateUrl: './punch-cards.component.html',
	styleUrls: ['./punch-cards.component.css']
})

export class PunchCardsComponent implements OnInit {

	constructor(private modalService: BsModalService,
		private repository: RepositoryService,
		private sorter: SortingService,
		private formBuilder: FormBuilder,
		private dateFormatService: DateFormatService,
		private route: ActivatedRoute) { }

	modalRef?: BsModalRef;
	modalTitle: string;

	members: Member[];
	transferMembers: Member[];
	selectedMemberId: number;
	transferMemberName: string;
	punchCards: PunchCard[];
	totalPurchaseAmount: number;
	totalRemainingPunches: number;
	defaultPunchCardCost: number;

	punchCardForm = this.formBuilder.group({
		purchaseMemberId: [0, [Validators.required, Validators.min(1)]],
		purchaseDate: [this.dateFormatService.formatDate(new Date()), Validators.required],
		purchaseAmount: [0, [Validators.required, Validators.min(0)]]
	});

	transferForm = this.formBuilder.group({
		punchCardId: 0,
		purchaseDate: new Date(),
		purchaseAmount: 0,
		purchaseMemberId: 0,
		currentMemberId: 0,
		currentMemberName: '',
		remainingPunches: 0,
		transferMemberId: [0, [Validators.required, Validators.min(1)]]
	});

	deleteId: number = 0;

	ngOnInit(): void {
		this.route.data.subscribe(
			(data: Data) => {
				this.defaultPunchCardCost = (data['defaults']).punchCardPrice;
			}
		);
		this.punchCardForm.patchValue({ 'purchaseAmount': this.defaultPunchCardCost.toFixed(2) });
		this.getMembers();
	}

	getMembers(): void {
		this.modalRef = this.modalService.show(LoadingComponent);
		this.repository.getMembers().subscribe(
			res => {
				this.members = this.sorter.sort(res, 'firstLastName', true);
			},
			() => { },
			() => {
				this.modalRef.hide();
			});
	}

	getPunchCards() {
		this.repository.getAllPunchCardsByMember(this.selectedMemberId).subscribe(
			res => {
				this.punchCards = res;
				this.totalPurchaseAmount = res.reduce(
					(runningTotal, punchCard) => runningTotal +
						(punchCard.purchaseMemberId == this.selectedMemberId ? punchCard.purchaseAmount : 0), 0
				);
				this.totalRemainingPunches = res.reduce(
					(runningTotal, punchCard) => runningTotal +
						(punchCard.currentMemberId == this.selectedMemberId ? punchCard.remainingPunches : 0), 0
				);
			}
		);
	}

	validateControl = (controlName: string) =>
		this.punchCardForm.controls[controlName].invalid && this.punchCardForm.controls[controlName].touched;

	hasError = (controlName: string, errorName: string) => this.punchCardForm.controls[controlName].hasError(errorName);

	onSelectedMemberChange() {
		this.selectedMemberId = this.punchCardForm.value['purchaseMemberId'];
		this.getTransferMembers();
		this.getPunchCards();
	}

	getTransferMembers() {
		this.repository.getTransferMembers(this.selectedMemberId).subscribe(
			res => {
				this.transferMembers = res;
			}
		);
	}

	onTransferMemberChange(transferMemberName: string) {
		this.transferMemberName = transferMemberName;
	}

	onPunchCardFormSubmit() {
		this.repository.addPunchCard(this.punchCardForm.value).subscribe(
			() => {
				this.getPunchCards();
				this.showOkModal("Success", "Punch card purchased.");
			}
		);
	}

	onTransferClick(punchCard: PunchCard, transferModal: TemplateRef<any>) {
		this.transferForm.setValue({
			'punchCardId': punchCard.punchCardId,
			'purchaseDate': this.dateFormatService.formatDate(punchCard.purchaseDate),
			'purchaseAmount': punchCard.purchaseAmount,
			'purchaseMemberId': punchCard.purchaseMemberId,
			'currentMemberId': punchCard.currentMemberId,
			'currentMemberName': punchCard.currentMemberName,
			'remainingPunches': punchCard.remainingPunches,
			'transferMemberId': this.transferMembers[0].memberId
		});
		this.transferMemberName = this.transferMembers[0].firstLastName;
		this.modalTitle = 'Transfer Punch Card';
		this.modalRef = this.modalService.show(transferModal);
	}

	onTransferFormSubmit() {
		this.transferForm.value['currentMemberId'] = this.transferForm.value['transferMemberId'];
		this.repository.updatePunchCard(this.transferForm.value).subscribe(
			res => {
				this.closeTransferForm();
				this.getPunchCards();
				this.showOkModal("Success", `Punch card transferred to ${this.transferMemberName}.`);
			}
		);
	}

	closeTransferForm() {
		this.transferForm.reset();
		this.modalRef?.hide();
	}

	confirmDelete(punchCard: PunchCard) {
		this.deleteId = punchCard.punchCardId;
		const initialState: ModalOptions = {
			initialState: {
				modalTitle: "WARNING! This action cannot be undone.",
				modalBody: "Are you sure you want to delete this punch card?"
			}
		};
		this.modalRef = this.modalService.show(ConfirmationDialogComponent, initialState);
		this.modalRef.content.event.subscribe((res: any) => {
			if (res) this.deletePunchCard();
		});
	}

	deletePunchCard() {
		this.repository.deletePunchCard(this.deleteId).subscribe(
			_ => {
				this.showOkModal("Success", "Punch card deleted.");
				this.getPunchCards();
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
