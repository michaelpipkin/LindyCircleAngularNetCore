import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-yesno-dialog',
  templateUrl: './yesno-dialog.component.html',
  styleUrls: ['./yesno-dialog.component.css']
})
export class YesnoDialogComponent {
    modalTitle?: string;
    modalBody?: string;
    public event: EventEmitter<any> = new EventEmitter();

    constructor(public modalRef: BsModalRef) { }

    onYes(): void {
        this.event.emit(true);
        this.modalRef.hide();
    }

    onNo(): void {
        this.event.emit(false);
        this.modalRef.hide();
    }
}
