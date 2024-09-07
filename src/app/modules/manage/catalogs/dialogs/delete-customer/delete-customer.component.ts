import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClientService} from 'src/app/services/client/client.service';

@Component({
	selector: 'app-delete-customer',
	templateUrl: './delete-customer.component.html',
	styleUrls: ['./delete-customer.component.scss'],
})
export class DeleteCustomerComponent implements OnInit {
	public fakeForm = this._formBuilder.group({
		IdClient: [this.data.info.IdClient, [Validators.required]],
		Status: [this.data.info.Status, [Validators.required]],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _clientService: ClientService,
		private _formBuilder: FormBuilder,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {}

	/* deleteClient() {
		const id = this.data.info.Status;
		console.log('Valor de this data, ', this.data.info);

		this._clientService.deleteClient(this.data.info.IdClient).subscribe(res => {
			this.dialogRef.close();
			this._snackBar.open('Cliente eliminando de manera correcta', '', {
				duration: 3500,
				verticalPosition: 'top',
				panelClass: ['background-snack-red'],
			});
		});
	} */

	deleteClient() {
		this._clientService.deleteClient(this.fakeForm.value).subscribe(res => {});
		this.closeDialog();
		this._snackBar.open('Cliente eliminando de manera correcta', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-red'],
		});
		/* window.location.reload(); */
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
