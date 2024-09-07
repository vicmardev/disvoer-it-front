import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {selectorValue} from 'src/app/models/selector-value';
import {BrandsService} from 'src/app/services/brands/brands.service';

@Component({
	selector: 'app-add-brand',
	templateUrl: './add-brand.component.html',
	styleUrls: ['./add-brand.component.scss'],
})
export class AddBrandComponent implements OnInit {
	public formAddBrand = this._formBuilder.group({
		namebrand: ['', [Validators.required]],
		description: ['', [Validators.required]],
	});

	constructor(
		private _snackBar: MatSnackBar,
		private _formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _addBrandService: BrandsService
	) {}

	ngOnInit(): void {}

	addBrand() {
		this._addBrandService.createBrand(this.formAddBrand.value).subscribe(res => {
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
		this._snackBar.open('Marca agregada con éxito.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	errorSnack() {
		this._snackBar.open('Error al agregar Marca.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
