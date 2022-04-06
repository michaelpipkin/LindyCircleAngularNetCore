import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-ok-dialog',
    templateUrl: './ok-dialog.component.html',
    styleUrls: ['./ok-dialog.component.css']
})

export class OkDialogComponent {
    modalTitle?: string;
    modalBody?: string;

    constructor(public modalRef: BsModalRef) { }
}
