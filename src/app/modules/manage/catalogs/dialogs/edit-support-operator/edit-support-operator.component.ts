import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {selectorValue} from 'src/app/models/selector-value';
import {SupportOperatorsService} from 'src/app/services/support-operators/support-operators.service';

@Component({
	selector: 'app-edit-support-operator',
	templateUrl: './edit-support-operator.component.html',
	styleUrls: ['./edit-support-operator.component.scss'],
})
export class EditSupportOperatorComponent implements OnInit {
	levelList: any;
	customerSelectorValues!: selectorValue[];
	formEditOperator!: FormGroup;

	constructor(
		private _snackBar: MatSnackBar,
		private _formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _editOperator: SupportOperatorsService
	) {}

	editOperator() {
		console.log(this.formEditOperator.value);

		this._editOperator.editOperator(this.formEditOperator.value).subscribe(res => {
			if (res) {
				this.closeSnack();
				this.closeDialog();
			} else {
				this.errorSnack();
			}
		});
	}

	ngOnInit(): void {
		console.log('Valor de data, ', this.data.info);

		this.formEditOperator = this._formBuilder.group({
			name: [this.data.info.Name, [Validators.required]],
			levelscalation: [this.data.info.IdLevelScalation, [Validators.required]],
			email: [this.data.info.Email, [Validators.required]],
			telephone: [this.data.info.Telephone, [Validators.required]],
			IdSupportOPerators: [this.data.info.IdSupportOPerators],
		});

		this._editOperator.getLevels().subscribe(result => {
			this.levelList = result;
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
