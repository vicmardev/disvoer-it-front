import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProvidersService} from 'src/app/services/providers/providers.service';

@Component({
	selector: 'app-delete-provider',
	templateUrl: './delete-provider.component.html',
	styleUrls: ['./delete-provider.component.scss'],
})
export class DeleteProviderComponent implements OnInit {
	public fakeForm = this._formBuilder.group({
		IdProvider: [this.data.info.IdProvider, [Validators.required]],
		Status: [this.data.info.Status, [Validators.required]],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _providerService: ProvidersService,
		private _formBuilder: FormBuilder,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {}

	deleteProvider() {
		this._providerService.deleteProvider(this.fakeForm.value).subscribe(res => {});
		this.closeDialog();
		this._snackBar.open('Proveedor eliminado de manera correcta', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-red'],
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
