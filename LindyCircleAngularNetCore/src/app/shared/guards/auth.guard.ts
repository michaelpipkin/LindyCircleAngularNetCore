import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private authService: AuthenticationService,
        private router: Router) { }

    canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this.authService.isUserAuthenticated()) {
			return true;
		} else {
			this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
			return false;
		}
	}

	canActivateChild(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this.authService.isUserAuthenticated()) {
			return true;
		} else {
			this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
			return false;
		}
	}
}
