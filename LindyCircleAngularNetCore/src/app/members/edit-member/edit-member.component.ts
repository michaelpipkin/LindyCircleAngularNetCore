import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '@app-shared/loading/loading.component';
import { RepositoryService } from '@app-shared/services/repository.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Member } from '../models/member.model';

@Component({
	selector: 'app-edit-member',
	templateUrl: './edit-member.component.html',
	styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent implements OnInit {
	@ViewChild('editMemberForm') editMemberForm: NgForm;
	errorMessage: string = "";
	member: Member;
	modalRef?: BsModalRef;

	constructor(private route: ActivatedRoute,
		private repository: RepositoryService,
		private router: Router,
		private modalService: BsModalService,) { }

	ngOnInit(): void {
		// + casts the param as a number
		const memberId: number = +this.route.snapshot.params['memberId'];

		this.repository.getMember(memberId).subscribe(
			(res: Member) => {
				this.member = res;
			});

	}

	onSubmit(): void {
		this.modalRef = this.modalService.show(LoadingComponent);
		this.repository.updateMember(this.member).subscribe(
			() => {
				this.router.navigate(['members', this.member.memberId]);
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
