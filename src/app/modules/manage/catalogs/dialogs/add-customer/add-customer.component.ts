import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ClientService} from 'src/app/services/client/client.service';

@Component({
	selector: 'app-add-customer',
	templateUrl: './add-customer.component.html',
	styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
	public formAddCustomer = this._formBuilder.group({
		name: ['', [Validators.required]],
		family: ['', [Validators.required]],
		razonsocial: ['', [Validators.required]],
		adressfiscal: ['', [Validators.required]],
		rfc: ['', [Validators.required]],
		ordencompra: ['', [Validators.required]],
	});

	constructor(
		private _snackBar: MatSnackBar,
		private _formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _clientService: ClientService
	) {}

	ngOnInit(): void {}

	addCustomer() {
		//console.log('data:', this.formAddCustomer.value);

		this._clientService.createClient(this.formAddCustomer.value).subscribe(res => {
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
		this._snackBar.open('Cliente agregado con éxito.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	errorSnack() {
		this._snackBar.open('Error al agregar cliente.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
