import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {selectorValue} from 'src/app/models/selector-value';
import {ProvidersService} from 'src/app/services/providers/providers.service';

@Component({
	selector: 'app-edit-provider',
	templateUrl: './edit-provider.component.html',
	styleUrls: ['./edit-provider.component.scss'],
})
export class EditProviderComponent implements OnInit {
	public formEditProvider = this._formBuilder.group({
		name: [this.data.info.Name, [Validators.required]],
		namecontact: [this.data.info.NameContact, [Validators.required]],
		phonecontact: [this.data.info.PhoneContact, [Validators.required]],
		emailcontact: [this.data.info.EmailContact, [Validators.required]],
		city: [this.data.info.City, [Validators.required]],
		country: [this.data.info.Country, [Validators.required]],
		delegation: [this.data.info.Delegation, [Validators.required]],
		postalcode: [this.data.info.PostalCode, [Validators.required]],
		internalnumber: [this.data.info.InternalNumber],
		externalnumber: [this.data.info.ExternalNumber, [Validators.required]],
		comments: [this.data.info.Comments, [Validators.required]],
		IdProvider: [this.data.info.IdProvider],
	});

	constructor(
		private _snackBar: MatSnackBar,
		private _formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _editProviderService: ProvidersService
	) {}

	ngOnInit(): void {}

	editProvider() {
		this._editProviderService.editProvider(this.formEditProvider.value).subscribe(res => {
			if (res) {
				this.closeSnack();
				this.closeDialog();
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
