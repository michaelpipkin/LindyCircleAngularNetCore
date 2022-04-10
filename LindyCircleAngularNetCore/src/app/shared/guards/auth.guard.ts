import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(private authService: AuthenticationService,
        private router: Router) { }

    canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isUserAuthenticated()) return true;
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
