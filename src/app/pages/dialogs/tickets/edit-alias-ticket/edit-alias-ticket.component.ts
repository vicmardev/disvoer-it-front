import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {TicketsService} from 'src/app/services/tickets/tickets.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
	selector: 'app-edit-alias-ticket',
	templateUrl: './edit-alias-ticket.component.html',
	styleUrls: ['./edit-alias-ticket.component.scss'],
})
export class EditAliasTicketComponent implements OnInit {
	public formEditRow = this._formBuilder.group({
		TicketID: [this.data.info.ticketID],
		Alias: [this.data.info.alias],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<any>,
		private _ticketServices: TicketsService,
		private _snackBar: MatSnackBar,
	) {}

	ngOnInit(): void {}

	updateAliasRow() {
		const ticketID = this.data.info.ticketID;
		const aliasData = this.formEditRow.value;

		this._ticketServices.setTicketAlias(aliasData).subscribe(res => {
			this.dialogRef.close();
				this.closeSnack();
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}

	closeSnack() {
		this._snackBar.open('Actualización de datos exitosa.', '', {
			duration: 3500,
			verticalPosition: 'top',
			/* horizontalPosition: 'center', */
			panelClass: ['background-snack'],
			/*  horizontalPosition: 'start',
		  verticalPosition: 'top', */
		});
	}
}
