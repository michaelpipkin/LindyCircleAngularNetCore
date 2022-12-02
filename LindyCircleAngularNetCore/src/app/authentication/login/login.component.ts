import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { environment } from '@env/environment';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

	constructor(private authService: AuthenticationService,
		private router: Router,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder) { }

	returnUrl: string = "/";

	loginForm = this.formBuilder.group({
		userName: ['', Validators.required],
		password: ['', Validators.required],
		clientUri: environment.CLIENT_URI + 'emailconfirmation'
	});

	ngOnInit(): void {
		this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
		//For debugging only - delete this region before publishing
		//#region Debugging login
		this.loginForm.patchValue({
			'userName': 'mpipkin',
			'password': 'Dance5^7*'
		});
		//this.loginUser();
		//#endregion
	}

	validateControl = (controlName: string) =>
		this.loginForm.controls[controlName].invalid && this.loginForm.controls[controlName].touched;

	controlHasError = (controlName: string, errorName: string) =>
		this.loginForm.controls[controlName].hasError(errorName);

	formHasError = (errorName: string) => this.loginForm.hasError(errorName);

	loginUser() {
		this.authService.loginUser(this.loginForm.value).subscribe(
			res => {
				sessionStorage.setItem("token", res.token);
				sessionStorage.setItem("roles", res.roles);
				sessionStorage.setItem("userName", res.userName);
				sessionStorage.setItem("email", res.email);
				this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
				this.router.navigate([this.returnUrl]);
			}
		)
	}
}
