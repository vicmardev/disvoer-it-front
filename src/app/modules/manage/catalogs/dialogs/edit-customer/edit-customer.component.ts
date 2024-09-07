import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClientService} from 'src/app/services/client/client.service';

@Component({
	selector: 'app-edit-customer',
	templateUrl: './edit-customer.component.html',
	styleUrls: ['./edit-customer.component.scss'],
})
export class EditCustomerComponent implements OnInit {
	public formEditClient = this._formBuilder.group({
		name: [this.data.info.Name, [Validators.required]],
		family: [this.data.info.Family, [Validators.required]],
		razonsocial: [this.data.info.RazonSocial, [Validators.required]],
		adressfiscal: [this.data.info.AdressFiscal, [Validators.required]],
		rfc: [this.data.info.RFC, [Validators.required]],
		ordencompra: [this.data.info.OrdenCompra, [Validators.required]],
		IdClient: [this.data.info.IdClient],
	});

	constructor(
		private _snackBar: MatSnackBar,
		private _formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _editClientService: ClientService
	) {}

	ngOnInit(): void {}

	editClient() {
		this._editClientService.editClient(this.formEditClient.value).subscribe(res => {
			if (res) {
				this.closeSnack();
				this.closeDialog();
				/* window.location.reload(); */
			} else {
				this.errorSnack();
			}
		});
	}

	closeSnack() {
		this._snackBar.open('Cambios Guardados.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	errorSnack() {
		this._snackBar.open('Error al Actualizar.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
