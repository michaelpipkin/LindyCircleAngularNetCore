import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OkDialogComponent } from '@app-shared/ok-dialog/ok-dialog.component';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { environment } from '@env/environment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-register-user',
    templateUrl: './register-user.component.html',
    styleUrls: ['./register-user.component.css']
})

export class RegisterUserComponent implements OnInit {

    constructor(private authService: AuthenticationService,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private router: Router) { }

    modalRef?: BsModalRef;
    modalTitle: string = "";
    errorMessage: string = "";
    showError: boolean = false;

    registerForm = this.formBuilder.group({
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        clientUri: environment.CLIENT_URI + 'emailconfirmation'
    }, { validator: this.validateConfirmPassword });

    ngOnInit(): void {
    }

	registerUser(): void {
        this.showError = false;
        this.authService.registerUser(this.registerForm.value).subscribe(
            () => {
                this.showOkModal("Success", `User ${this.registerForm.value.userName} registered successfully. Please log in.`);
                this.router.navigate(['/authentication/login']);
            },
            (err: Error) => {
                this.errorMessage = err.message;
                this.showError = true;
            }
        );
    }

	validateControl(controlName: string, errorName: string): boolean {
		let control = this.registerForm.controls[controlName];
		return control.touched && control.invalid && control.hasError(errorName);
	}

    validateConfirmPassword(control: AbstractControl): ValidationErrors | null {
        const password = control.get("password")?.value;
        const confirm = control.get("confirmPassword")?.value;

        return password == confirm ? null : { noMatch: true };
    }

	formHasError(errorName: string): boolean {
		return !this.registerForm.controls['confirmPassword'].hasError('required') &&
			this.registerForm.hasError(errorName);
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
