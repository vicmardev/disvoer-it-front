import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketsService } from 'src/app/services/tickets/tickets.service';


@Component({
  selector: 'app-create-ticket-alert',
  templateUrl: './create-ticket-alert.component.html',
  styleUrls: ['./create-ticket-alert.component.scss'],
})
export class CreateTicketAlertComponent implements OnInit {

  isCreated: boolean = false;
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private _snackBar: MatSnackBar,
    private _ticketServices: TicketsService
  ) {}

  ngOnInit(): void {
  }

 
  closeDialog() {
    this.dialogRef.close();
  }
  closeSnack() {
    this._snackBar.open('Ticket Creado con Exito.', '', {
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack'],
    });
  }

  createNewTicket() {

    this._ticketServices.createTicket(this.data.info).subscribe({
      next: (res) =>{
        this.closeDialog();
        this.closeSnack();
        this.isCreated = true;
        console.log(this.data.info);
      },
      error: error =>{
        this.errorSnack(error);
      }
    })

  }

  errorSnack(error: any) {
    this._snackBar.open('Error al crear Ticket comunicate  con el  admin: '+ error, '', {
      duration: 3500,
      verticalPosition: 'top',
      panelClass: ['background-snack-red'],
    });
  }
}
