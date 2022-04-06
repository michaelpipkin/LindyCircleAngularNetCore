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

    registerUser() {
        this.showError = false;
        this.authService.registerUser(this.registerForm.value).subscribe(
            _ => {
                this.showOkModal("Success", `User ${this.registerForm.value.userName} registered successfully. Please log in.`);
                this.router.navigate(['/authentication/login']);
            },
            error => {
                this.errorMessage = error;
                this.showError = true;
            }
        );
    }

    validateControl = (controlName: string) =>
        this.registerForm.controls[controlName].invalid && this.registerForm.controls[controlName].touched;

    validateConfirmPassword(control: AbstractControl): ValidationErrors | null {
        const password = control.get("password")?.value;
        const confirm = control.get("confirmPassword")?.value;

        return password == confirm ? null : { noMatch: true };
    }

    controlHasError = (controlName: string, errorName: string) =>
        this.registerForm.controls[controlName].hasError(errorName);

    formHasError = (errorName: string) => this.registerForm.hasError(errorName);

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
