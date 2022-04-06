import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ErrorNotificationComponent } from '@app-shared/error-notification/error-notification.component';
import { AuthenticationService } from '@app-shared/services/authentication.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Injectable({
    providedIn: 'root'
})

export class AdminGuard implements CanActivate {

    constructor(private authService: AuthenticationService,
        private modalService: BsModalService    ) { }

    modalRef?: BsModalRef;

    canActivate() {
        if (this.authService.isUserAdmin())
            return true;
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

    showErrorModal(error: any) {
        const initialState: ModalOptions = {
            initialState: {
                error: error
            }
        };
        this.modalRef = this.modalService.show(ErrorNotificationComponent, initialState);
    }
}
