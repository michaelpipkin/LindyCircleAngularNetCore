import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RepositoryService } from '../../shared/services/repository.service';

@Component({
	selector: 'app-add-member',
	templateUrl: './add-member.component.html',
	styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {
	errorMessage: string = "";

	memberForm = this.formBuilder.group({
		memberId: 0,
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		inactive: false
	});

	constructor(private repository: RepositoryService,
		private formBuilder: FormBuilder,
		private router: Router) { }

	ngOnInit(): void {
	}

	validateControl = (controlName: string) =>
		this.memberForm.controls[controlName].invalid && this.memberForm.controls[controlName].touched;

	hasError = (controlName: string, errorName: string) => this.memberForm.controls[controlName].hasError(errorName);

	onMemberFormSubmit() {
		this.repository.addMember(this.memberForm.value).subscribe(
			() => {
				this.router.navigate(['members']);
			},
			err => {
				this.errorMessage = err.detail;
			}
		);
	}
}
