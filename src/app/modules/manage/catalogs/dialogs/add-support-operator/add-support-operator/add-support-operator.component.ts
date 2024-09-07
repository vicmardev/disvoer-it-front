import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {selectorValue} from 'src/app/models/selector-value';
import {SupportOperatorsService} from 'src/app/services/support-operators/support-operators.service';

@Component({
	selector: 'app-add-support-operator',
	templateUrl: './add-support-operator.component.html',
	styleUrls: ['./add-support-operator.component.scss'],
})
export class AddSupportOperatorComponent implements OnInit {
	levelList: any;
	customerSelectorValues!: selectorValue[];
	public formAddSupportOperator = this._formBuilder.group({
		name: ['', [Validators.required]],
		levelscalation: ['', [Validators.required]],
		email: ['', [Validators.required]],
		telephone: ['', [Validators.required]],
	});

	constructor(
		private _snackBar: MatSnackBar,
		private _formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _supportOperatorService: SupportOperatorsService
	) {}

	ngOnInit(): void {
		this._supportOperatorService.getLevels().subscribe(result => {
			this.levelList = result;
		});
	}

	addSupportOperator() {
		this._supportOperatorService
			.createSupportOperator(this.formAddSupportOperator.value)
			.subscribe(res => {
				if (res) {
					this.closeDialog();
					this.closeSnack();
					window.location.reload();
				} else {
					this.errorSnack();
				}
			});
	}

	closeSnack() {
		this._snackBar.open('Operador agregado con éxito.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	errorSnack() {
		this._snackBar.open('Error al agregar operador.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
