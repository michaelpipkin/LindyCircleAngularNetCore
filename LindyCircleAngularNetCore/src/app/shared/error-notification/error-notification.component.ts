import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-error-notification',
    templateUrl: './error-notification.component.html',
    styleUrls: ['./error-notification.component.css']
})

export class ErrorNotificationComponent implements OnInit {
    error: any;
    errorTitle?: string;
    errorStatusCode?: string;
    errorDetail?: string;

    constructor(public modalRef: BsModalRef) { }

    ngOnInit(): void {
        this.errorStatusCode = `${this.error.status}: ${this.error.name}`;
        if (this.error.error == null) {
            this.errorTitle = "An error has occurred";
            this.errorDetail = this.error.message;
        }
        else if (this.error.error.errors != null) {
            var errorDetail: string = "";
            for (var prop in this.error.error.errors) {
                if (typeof (this.error.error.errors[prop]) == 'string')
                    errorDetail += this.error.error.errors[prop] + '\r\n';
                else errorDetail += this.error.error.errors[prop][0] + '\r\n';
            }
            this.errorDetail = errorDetail.slice(0, -4);
        }
        else this.errorDetail = this.error.error.detail;
    }
}
