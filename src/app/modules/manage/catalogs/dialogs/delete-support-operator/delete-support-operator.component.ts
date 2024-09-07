import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SupportOperatorsService} from 'src/app/services/support-operators/support-operators.service';

@Component({
	selector: 'app-delete-support-operator',
	templateUrl: './delete-support-operator.component.html',
	styleUrls: ['./delete-support-operator.component.scss'],
})
export class DeleteSupportOperatorComponent implements OnInit {
	public fakeForm = this._formBuilder.group({
		IdSupportOPerators: [this.data.info.IdSupportOPerators, [Validators.required]],
		Status: [this.data.info.Status, [Validators.required]],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _supportOperatorService: SupportOperatorsService,
		private _formBuilder: FormBuilder,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {}

	deleteSupportOperator() {
		this._supportOperatorService
			.deleteSupportOperator(this.fakeForm.value)
			.subscribe(res => {});
		this.closeDialog();
		this._snackBar.open('Operador eliminando de manera correcta', '', {
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
