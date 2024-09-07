import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HelpCenterService} from 'src/app/services/helpCenter/help-center.service';

@Component({
	selector: 'app-delete-faq',
	templateUrl: './delete-faq.component.html',
	styleUrls: ['./delete-faq.component.scss'],
})
export class DeleteFaqComponent implements OnInit {
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _helpCenterService: HelpCenterService,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {}

	deleteEntry() {
		const id = this.data.info.Idfaqs;
		this._helpCenterService.deleteFaq(id).subscribe(() => {
			this.dialogRef.close();
			this._snackBar.open('Pregunta eliminanda de manera correcta', '', {
				duration: 3500,
				verticalPosition: 'top',
				panelClass: ['background-snack-red'],
			});
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
