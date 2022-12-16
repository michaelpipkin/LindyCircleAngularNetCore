import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
    titleText: string;
	bodyText: string;
	falseButtonText: string = "Cancel";
	falseButtonType: string = "secondary";
	falseButtonClass: string = "btn btn-secondary";
	trueButtonText: string = "Confirm";
	trueButtonType: string = "primary";
	trueButtonClass: string = "btn btn-primary";

    public event: EventEmitter<any> = new EventEmitter();

    constructor(public modalRef: BsModalRef) { }

	ngOnInit(): void {
		this.trueButtonClass = `btn btn-${this.trueButtonType}`;
		this.falseButtonClass = `btn btn-${this.falseButtonType}`;
	}

    onConfirm(): void {
        this.event.emit(true);
        this.modalRef.hide();
    }

    onCancel(): void {
        this.event.emit(false);
        this.modalRef.hide();
    }
}
