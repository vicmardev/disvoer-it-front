import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {selectorValue} from 'src/app/models/selector-value';
import {BrandsService} from 'src/app/services/brands/brands.service';

@Component({
	selector: 'app-edit-brand',
	templateUrl: './edit-brand.component.html',
	styleUrls: ['./edit-brand.component.scss'],
})
export class EditBrandComponent implements OnInit {
	public formEditBrand = this._formBuilder.group({
		namebrand: [this.data.info.NameBrand, [Validators.required]],
		description: [this.data.info.Description, [Validators.required]],
		IdBrand: [this.data.info.IdBrand],
	});

	constructor(
		private _snackBar: MatSnackBar,
		private _formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _editBrandService: BrandsService
	) {}

	ngOnInit(): void {
		console.log('valor de la marca: ', this.data);
	}

	editBrand() {
		this._editBrandService.editBrand(this.formEditBrand.value).subscribe(res => {
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
