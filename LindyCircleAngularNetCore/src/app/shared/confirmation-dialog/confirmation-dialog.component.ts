import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
    titleText: string;
	bodyText: string;
	falseButtonText: string = "Cancel";
	falseButtonClass: string = "btn btn-secondary";
	trueButtonText: string = "Confirm";
	trueButtonClass: string = "btn btn-primary";

    public event: EventEmitter<any> = new EventEmitter();

    constructor(public modalRef: BsModalRef) { }

    onConfirm(): void {
        this.event.emit(true);
        this.modalRef.hide();
    }

    onCancel(): void {
        this.event.emit(false);
        this.modalRef.hide();
    }
}
