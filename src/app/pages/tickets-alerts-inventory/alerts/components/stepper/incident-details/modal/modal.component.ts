import { Component, Inject, Input, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

    contract: string = '';

    @Input() modal: any;

    public formEdit = this._formBuilder.group({
        titleTicket: [''],
        location: [''],
        userPhone: ['']
    })

    ticketID: any;

    constructor(
        @Inject(
            MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<any>,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _TicketService: TicketsService
    ) { }



    ngOnInit(): void {
        this.setValuesForm();
        this.data.info;
    }


    updateTicket() {
        this._TicketService.updateAlertTicket(this.data.id, this.formEdit.value, '').subscribe(res => {
            if (res) {
                this.closeDialog(res);
            } else {
                this.errorSnack();
            }
        });
    }


    closeDialog(data: any) {
        this.dialogRef.close(data);
    }

    closeSnack() {
        this._snackBar.open('Info modificada con exito.', '', {
            duration: 3500,
        verticalPosition: 'top',
            panelClass: ['background-snack-info']
        });
    }

    errorSnack() {
        this._snackBar.open('Error al actualizar info', '', {
            duration: 3500,
        verticalPosition: 'top',
            panelClass: ['background-snack-info']
        });
    }



    ngOnChanges(changes: SimpleChanges): void {
        this.contract = this.modal.contract;
    }

    setValuesForm(){
        console.log('aaa', this.data.info);
        this.formEdit.controls['titleTicket'].setValue(this.data.info.titleTicket);
        this.formEdit.controls['location'].setValue(this.data.info.location);
        this.formEdit.controls['userPhone'].setValue(this.data.info.userPhone);
    }




}
