import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app-shared/services/authentication.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
	isUserAuthenticated: boolean = this.authService.isUserAuthenticated();
	isUserAdmin: boolean = this.authService.isUserAdmin();

	constructor(private authService: AuthenticationService,
		private router: Router) {
		this.authService.authChanged.subscribe(
			res => {
				this.isUserAuthenticated = res;
				this.isUserAdmin = this.authService.isUserAdmin();
			}
		);
	}

	ngOnInit(): void {
	}

	logout = () => {
		this.authService.logout();
		this.router.navigate(["/"]);
	}
}
