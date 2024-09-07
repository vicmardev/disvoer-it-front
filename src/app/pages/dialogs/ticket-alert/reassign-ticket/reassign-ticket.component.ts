import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-reassign-ticket',
  templateUrl: './reassign-ticket.component.html',
  styleUrls: ['./reassign-ticket.component.scss']
})
export class ReassignTicketComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _ticketServices: TicketsService
  ) {

   }

  ngOnInit(): void {
  }

  reassignTicket(){
    let approvedTicket = this.data.info;
    approvedTicket.stepTicket = 3;
    if( this.data.type == "inventory"){
      approvedTicket.status = "Reassigned"
      this._ticketServices.reassignInventoryTicket(approvedTicket.id, approvedTicket).pipe(first()).subscribe( res =>
        {
          if (res) {
            this.closeDialog();
            this.closeSnack();
          } else {
            this.errorSnack();
          }
        }
        )
      }
      else{
      approvedTicket.statusTicket = "Reassigned"
      this._ticketServices.reassignAlertTicket(approvedTicket.id, approvedTicket).pipe(first()).subscribe( res =>
        {
          if (res) {
            this.closeDialog();
            this.closeSnack();
          } else {
            this.errorSnack();
          }
        }
      )
    }
  }

  closeDialog(){
    //returns 3 to go to step 3, meaning ticket is reassigned
    this.dialogRef.close(3);
  }

  closeSnack() {
    const msg = 'Ticket Actualizado con Exito.';
    this._snackBar.open(msg, '', {
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack'],
      /*  horizontalPosition: 'start',
      verticalPosition: 'top', */
    });
  }

  errorSnack() {
    this._snackBar.open('Error al modificar el ticket, intentalo de nuevo o comunicate  con tu administrador', '', {
      duration: 3500,
      verticalPosition: 'top',
      panelClass: ['background-snack'],
    });
  }


}
