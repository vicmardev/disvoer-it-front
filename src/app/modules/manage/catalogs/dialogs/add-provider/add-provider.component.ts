import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {selectorValue} from 'src/app/models/selector-value';
import {ProvidersService} from 'src/app/services/providers/providers.service';

@Component({
	selector: 'app-add-provider',
	templateUrl: './add-provider.component.html',
	styleUrls: ['./add-provider.component.scss'],
})
export class AddProviderComponent implements OnInit {
	public formAddProvider = this._formBuilder.group({
		name: ['', [Validators.required]],
		namecontact: ['', [Validators.required]],
		phonecontact: ['', [Validators.required]],
		emailcontact: ['', [Validators.required]],
		city: ['', [Validators.required]],
		country: ['', [Validators.required]],
		delegation: ['', [Validators.required]],
		postalcode: ['', [Validators.required]],
		internalnumber: [''],
		externalnumber: ['', [Validators.required]],
		comments: ['', [Validators.required]],
	});

	constructor(
		private _snackBar: MatSnackBar,
		private _formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _addProvider: ProvidersService
	) {}

	ngOnInit(): void {}

	addProvider() {
		this._addProvider.createProvider(this.formAddProvider.value).subscribe(res => {
			if (res) {
				this.closeSnack();
				this.closeDialog();
				window.location.reload();
			} else {
				this.errorSnack();
			}
		});
	}

	closeSnack() {
		this._snackBar.open('Proveedor agregado con éxito.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	errorSnack() {
		this._snackBar.open('Error al agregar Proveedor.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
