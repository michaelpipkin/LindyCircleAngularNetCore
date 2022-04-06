import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ErrorNotificationComponent } from '@app-shared/error-notification/error-notification.component';

@Injectable({
    providedIn: 'root'
})

export class ErrorHandlerService implements HttpInterceptor {

    constructor(private router: Router,
        private modalService: BsModalService) { }

    modalRef?: BsModalRef;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = this.handleError(error);
                return throwError(errorMessage);
            })
        )
    }

    private handleError(error: HttpErrorResponse): string {
        if (error.status === 400) {
            return this.handleBadRequest(error);
        }
        if (error.status === 403) {
            var forbiddenError = {
                "name": "Forbidden",
                "status": "403",
                "error": {
                    "title": "Forbidden",
                    "detail": "You do not have permission to perform this action."
                }
            }
            this.showErrorModal(forbiddenError);
            return error.message;
        }
        if (error.status === 404) {
            this.router.navigate(['/']);
            return error.message;
        }
        this.showErrorModal(error);
        return error.message;
    }

    private showErrorModal(error: any) {
        const initialState: ModalOptions = {
            initialState: {
                error: error
            }
        };
        this.modalRef = this.modalService.show(ErrorNotificationComponent, initialState);
    }

    private handleBadRequest = (error: HttpErrorResponse): string => {
        if (this.router.url === '/register' ||
            this.router.url === '/profile' ||
            this.router.url.startsWith('/reset')) {
            let message: string = '';
            for (var prop in error.error.errors) {
                if (typeof (error.error.errors[prop]) == 'string')
                    message += error.error.errors[prop] + '<br/>';
                else message += error.error.errors[prop][0] + '<br/>';
            }
            return message.slice(0, -5);
        }
        else {
            return error.error ? error.error : error.message;
        }
    }
}
