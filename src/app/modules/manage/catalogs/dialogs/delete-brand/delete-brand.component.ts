import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BrandsService} from 'src/app/services/brands/brands.service';

@Component({
	selector: 'app-delete-brand',
	templateUrl: './delete-brand.component.html',
	styleUrls: ['./delete-brand.component.scss'],
})
export class DeleteBrandComponent implements OnInit {
	public fakeForm = this._formBuilder.group({
		IdBrand: [this.data.info.IdBrand, [Validators.required]],
		Status: [this.data.info.Status, [Validators.required]],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _brandService: BrandsService,
		private _formBuilder: FormBuilder,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {}

	deleteBrand() {
		this._brandService.deleteBrand(this.fakeForm.value).subscribe(res => {});
		this.closeDialog();
		this._snackBar.open('Marca eliminada de manera correcta', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-red'],
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
