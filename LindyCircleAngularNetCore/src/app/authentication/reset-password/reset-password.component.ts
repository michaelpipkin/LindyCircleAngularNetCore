import { Component, OnInit } from '@angular/core';
import { ResetPasswordDto } from '@app-shared/interfaces/resetPasswordDto';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {
    errorMessage: string = "";
    showError: boolean = false;
    successMessage: string = "";
    showSuccess: boolean = false;

    private token?: string;
    private userName?: string;

    constructor(private authService: AuthenticationService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParams['token'];
        this.userName = this.route.snapshot.queryParams['userName'];
    }

    resetForm = this.formBuilder.group({
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
    }, { validator: this.validateConfirmPassword });

    validateControl = (controlName: string) =>
        this.resetForm.controls[controlName].invalid && this.resetForm.controls[controlName].touched;

    validateConfirmPassword(control: AbstractControl): ValidationErrors | null {
        const password = control.get("password")?.value;
        const confirm = control.get("confirmPassword")?.value;

        return password == confirm ? null : { noMatch: true };
    }

    controlHasError = (controlName: string, errorName: string) =>
        this.resetForm.controls[controlName].hasError(errorName);

    formHasError = (errorName: string) => this.resetForm.hasError(errorName);

    resetPassword() {
        this.showError = this.showSuccess = false;
        const resetPasswordDto: ResetPasswordDto = {
            userName: this.userName!,
            token: this.token!,
            password: this.resetForm.value.password,
            confirmPassword: this.resetForm.value.confirmPassword
        };

        this.authService.resetPassword(resetPasswordDto).subscribe(
            _ => {
                this.resetForm.reset();
                this.showSuccess = true;
            },
            error => {
                this.showError = true;
                this.errorMessage = error;
            });
    }
}
