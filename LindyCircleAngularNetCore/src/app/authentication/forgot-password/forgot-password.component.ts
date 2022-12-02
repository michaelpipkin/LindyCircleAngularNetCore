import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { environment } from '@env/environment';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
    successMessage: string = "";
    errorMessage: string = "";
    showSuccess: boolean = false;
    showError: boolean = false;

    constructor(private authService: AuthenticationService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
    }

    forgotForm = this.formBuilder.group({
        userName: ['', Validators.required]
    });

    validateControl = (controlName: string) =>
        this.forgotForm.controls[controlName].invalid && this.forgotForm.controls[controlName].touched;

    controlHasError = (controlName: string, errorName: string) =>
        this.forgotForm.controls[controlName].hasError(errorName);

    formHasError = (errorName: string) => this.forgotForm.hasError(errorName);

    forgotPassword() {
        this.showError = this.showSuccess = false;

        const forgotPasswordDto = {
            userName: this.forgotForm.value.userName,
            clientUri: environment.CLIENT_URI + 'account/resetpassword'
        };

        this.authService.forgotPassword(forgotPasswordDto).subscribe(
            _ => {
                this.forgotForm.reset();
                this.showSuccess = true;
                this.successMessage = "A password reset email has been sent. Please click the link in the email to reset your password.";
            },
            error => {
                this.showError = true;
                this.errorMessage = error;
            });
    }
}
