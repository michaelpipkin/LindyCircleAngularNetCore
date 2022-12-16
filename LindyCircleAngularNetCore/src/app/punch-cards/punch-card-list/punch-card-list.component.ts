import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { LoadingComponent } from '@app-shared/loading/loading.component';
import { OkDialogComponent } from '@app-shared/ok-dialog/ok-dialog.component';
import { DateFormatService } from '@app-shared/services/date-format.service';
import { Defaults } from '@app-shared/services/defaults-resolver.service';
import { RepositoryService } from '@app-shared/services/repository.service';
import { SortingService } from '@app-shared/services/sorting.service';
import { Member } from 'app/members/models/member.model';
import { PunchCard } from 'app/punch-cards/models/punch-card.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-punch-card-list',
	templateUrl: './punch-card-list.component.html',
	styleUrls: ['./punch-card-list.component.css']
})

export class PunchCardListComponent implements OnInit {
	members: Member[];
	transferMembers: Member[];
	selectedMemberId: number;
	transferMemberName: string;
	punchCardPrice: number;
	punchCards: PunchCard[];
	punchCardForm: FormGroup;
	totalPurchaseAmount: number;
	totalRemainingPunches: number;
	modalRef?: BsModalRef;
	modalTitle: string;

	constructor(private modalService: BsModalService,
		private repository: RepositoryService,
		private sorter: SortingService,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private dateFormatService: DateFormatService) { }

	transferForm: FormGroup = this.formBuilder.group({
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
		this.punchCardPrice = this.route.snapshot.data['defaults'].punchCardPrice;
		this.punchCardForm = new FormGroup({
			'purchaseMemberId': new FormControl(0, [Validators.required, Validators.min(1)]),
			'purchaseDate': new FormControl(this.dateFormatService.formatDate(new Date()), Validators.required),
			'purchaseAmount': new FormControl(this.punchCardPrice.toFixed(2), [Validators.required, Validators.min(0)])
		});
		this.modalRef = this.modalService.show(LoadingComponent);
		this.repository.getMembers().subscribe(
			(res: Member[]) => {
				this.members = this.sorter.sort(res, 'firstLastName', true);
			},
			() => {
				this.modalRef.hide();
			},
			() => {
				this.modalRef.hide();
			}
		);
	}

	getPunchCards(): void {
		this.repository.getAllPunchCardsByMember(this.selectedMemberId).subscribe(
			(res: PunchCard[]) => {
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

	validateControl(controlName: string, errorName: string): boolean {
		let control = this.punchCardForm.controls[controlName];
		return control.touched && control.invalid && control.hasError(errorName);
	}

	onSelectedMemberChange(): void {
		this.selectedMemberId = this.punchCardForm.value['purchaseMemberId'];
		this.getTransferMembers();
		this.getPunchCards();
	}

	getTransferMembers(): void {
		this.repository.getTransferMembers(this.selectedMemberId).subscribe(
			res => {
				this.transferMembers = res;
			}
		);
	}

	onAmountBlur(): void {
		if (this.punchCardForm.controls['purchaseAmount'].valid) {
			this.punchCardForm.patchValue({
				purchaseAmount: this.punchCardForm.value['purchaseAmount'].toFixed(2)
			});
		}
	}

	onTransferMemberChange(transferMemberName: string): void {
		this.transferMemberName = transferMemberName;
	}

	onSubmit(): void {
		this.repository.addPunchCard(this.punchCardForm.value).subscribe(
			() => {
				this.getPunchCards();
				this.showOkModal("Success", "Punch card purchased.");
			}
		);
	}

	onTransferClick(punchCard: PunchCard, transferModal: TemplateRef<any>): void {
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

	onTransferFormSubmit(): void {
		this.transferForm.value['currentMemberId'] = this.transferForm.value['transferMemberId'];
		this.repository.updatePunchCard(this.transferForm.value).subscribe(
			_ => {
				this.closeTransferForm();
				this.getPunchCards();
				this.showOkModal("Success", `Punch card transferred to ${this.transferMemberName}.`);
			}
		);
	}

	closeTransferForm(): void {
		this.transferForm.reset();
		this.modalRef?.hide();
	}

	confirmDelete(punchCard: PunchCard): void {
		this.deleteId = punchCard.punchCardId;
		const initialState: ModalOptions = {
			initialState: {
				titleText: "WARNING! This action cannot be undone.",
				bodyText: "Are you sure you want to delete this punch card?",
				falseButtonText: 'Cancel',
				trueButtonText: 'Delete',
				trueButtonType: 'danger'
			}
		};
		this.modalRef = this.modalService.show(ConfirmationDialogComponent, initialState);
		this.modalRef.content.event.subscribe((res: any) => {
			if (res) this.deletePunchCard();
		});
	}

	deletePunchCard(): void {
		this.repository.deletePunchCard(this.deleteId).subscribe(
			_ => {
				this.showOkModal("Success", "Punch card deleted.");
				this.getPunchCards();
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
