import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingComponent } from '@app-shared/loading/loading.component';
import { RepositoryService } from '@app-shared/services/repository.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Member } from '../models/member.model';

@Component({
	selector: 'app-add-member',
	templateUrl: './add-member.component.html',
	styleUrls: ['./add-member.component.css']
})

// This is a template-driven form
export class AddMemberComponent implements OnInit {
	@ViewChild('newMemberForm') newMemberForm: NgForm;
	errorMessage: string = "";

	modalRef?: BsModalRef;

	constructor(private modalService: BsModalService,
		private repository: RepositoryService,
		private router: Router) { }

	ngOnInit(): void {
	}

	onSubmit() {
		this.modalRef = this.modalService.show(LoadingComponent);
		let newMember: Member = <Member>this.newMemberForm.value;
		newMember.memberId = 0;
		newMember.inactive = false;
		this.repository.addMember(newMember).subscribe(
			() => {
				this.router.navigate(['members']);
			},
			err => {
				this.modalRef.hide();
				this.errorMessage = err.detail;
			},
			() => {
				this.modalRef.hide();
			}
		);
	}
}
