import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ErrorNotificationComponent } from '@app-shared/error-notification/error-notification.component';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Injectable({
    providedIn: 'root'
})

export class AdminGuard implements CanActivate, CanActivateChild {

    constructor(private authService: AuthenticationService,
        private modalService: BsModalService    ) { }

    modalRef?: BsModalRef;

    canActivate(): boolean {
		if (this.authService.isUserAdmin()) {
			return true;
		} else {
			var forbiddenError = {
				"name": "Forbidden",
				"status": "403",
				"error": {
					"title": "Forbidden",
					"detail": "You do not have permission to access that page."
				}
			}
			this.showErrorModal(forbiddenError);
			return false;
		}
	}

	canActivateChild(): boolean {
		if (this.authService.isUserAdmin()) {
			return true;
		} else {
			var forbiddenError = {
				"name": "Forbidden",
				"status": "403",
				"error": {
					"title": "Forbidden",
					"detail": "You do not have permission to access that page."
				}
			}
			this.showErrorModal(forbiddenError);
			return false;
		}
	}

    showErrorModal(error: any): void {
        const initialState: ModalOptions = {
            initialState: {
                error: error
            }
        };
        this.modalRef = this.modalService.show(ErrorNotificationComponent, initialState);
    }
}
