import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HelpCenterService} from 'src/app/services/helpCenter/help-center.service';

@Component({
	selector: 'app-create-faq',
	templateUrl: './create-faq.component.html',
	styleUrls: ['./create-faq.component.scss'],
})
export class CreateFaqComponent implements OnInit {
	public formCreateFaq = this._formBuilder.group({
		question: ['', [Validators.required]],
		response: ['', [Validators.required]],
		questiontype: ['', [Validators.required]],
		area: ['', [Validators.required]],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<any>,
		private _formBuilder: FormBuilder,
		private _helCenterService: HelpCenterService
	) {}

	ngOnInit(): void {}

	closeDialog() {
		this.dialogRef.close();
	}

	createNewFaq() {
		console.log('Entro a createNewFaq del dialogo de crear', this.formCreateFaq.value);

		this._helCenterService.createFaq(this.formCreateFaq.value).subscribe(res => {
			if (res) {
				this.closeDialog();
				this.closeSnack();
			} else {
				this.errorSnack();
			}
		});
	}

	errorSnack() {
		this._snackBar.open('Error al crear la pregunta, comunicate con el admin', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	closeSnack() {
		this._snackBar.open('Pregunta creada con exito.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}
}
