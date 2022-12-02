import { Component, OnInit } from '@angular/core';
import { ChangePasswordDto } from '@app-shared/interfaces/changePasswordDto';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
    errorMessage: string = "";
    showError: boolean = false;
    successMessage: string = "";
    showSuccess: boolean = false;
    userName: string = "";
    email: string = "";

    constructor(private authService: AuthenticationService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.userName = sessionStorage.getItem("userName")!;
        this.email = sessionStorage.getItem("email")!;
    }

    changeForm = this.formBuilder.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required]
    }, { validator: this.validateConfirmPassword });

    validateControl = (controlName: string) =>
        this.changeForm.controls[controlName].invalid && this.changeForm.controls[controlName].touched;

    validateConfirmPassword(control: AbstractControl): ValidationErrors | null {
        const newPassword = control.get("newPassword")?.value;
        const confirmPassword = control.get("confirmPassword")?.value;

        return newPassword == confirmPassword ? null : { noMatch: true };
    }

    controlHasError = (controlName: string, errorName: string) =>
        this.changeForm.controls[controlName].hasError(errorName);

    formHasError = (errorName: string) => this.changeForm.hasError(errorName);

    changePassword() {
        this.showError = this.showSuccess = false;
        const changePasswordDto: ChangePasswordDto = {
            userName: this.userName,
            currentPassword: this.changeForm.value.currentPassword,
            newPassword: this.changeForm.value.newPassword,
            confirmPassword: this.changeForm.value.confirmPassword
        };

        this.authService.changePassword(changePasswordDto).subscribe(
            _ => {
                this.changeForm.reset();
                this.showSuccess = true;
            },
            error => {
                this.showError = true;
                this.errorMessage = error;
            }
        )
    }
}
