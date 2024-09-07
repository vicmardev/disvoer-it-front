import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HelpCenterService} from 'src/app/services/helpCenter/help-center.service';

@Component({
	selector: 'app-add-edit-faq',
	templateUrl: './add-edit-faq.component.html',
	styleUrls: ['./add-edit-faq.component.scss'],
})
export class AddEditFaqComponent implements OnInit {
	faqResponse!: FormGroup;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _formBuilder: FormBuilder,
		private _helCenterService: HelpCenterService,
		private _snackBar: MatSnackBar
	) {}

	/* public faqResponse = this._formBuilder.group({
		question: [this.data.info.question, [Validators.required]],
		response: [this.data.info.response, [Validators.required]],
		questiontype: [this.data.info.questiontype, [Validators.required]],
	}); */

	ngOnInit(): void {
		this.faqResponse = this._formBuilder.group({
			question: [this.data.info.Question, [Validators.required]],
			response: [this.data.info.Response, [Validators.required]],
			questiontype: [this.data.info.Questiontype, [Validators.required]],
		});
		console.log('Valor de data', this.data);
	}

	updateFaq() {
		this._helCenterService
			.updateFaq(this.data.info.Idfaqs, this.faqResponse.value)
			.subscribe(res => {
				if (res) {
					this.closeDialog();
					this.closeSnack();
				} else {
					this.errorSnack();
				}
			});
	}

	closeDialog() {
		this.dialogRef.close();
	}

	closeSnack() {
		this._snackBar.open('Pregunta modificada con éxito.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-info'],
		});
	}

	errorSnack() {
		this._snackBar.open('Error al actualizar la pregunta', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-info'],
		});
	}
}
