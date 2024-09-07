import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {QuoteService} from 'src/app/services/quotes/quote.service';

@Component({
	selector: 'app-delete-quote',
	templateUrl: './delete-quote.component.html',
	styleUrls: ['./delete-quote.component.scss'],
})
export class DeleteQuoteComponent implements OnInit {
	id = -1;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private quoteService: QuoteService,
		private dialogRef: MatDialogRef<any>,
		private snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.id = this.data.id;
	}

	deleteQuote() {
		this.quoteService.deleteQuote(this.id).subscribe({
			next: (selectors: any) => {
				this.successSnack();
				this.closeDialog();
			},
			error: err => {
				this.errorSnack(err);
				this.closeDialog();
			},
		});
	}

	successSnack() {
		this.snackBar.open('Actualización de datos exitosa.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	errorSnack(error: any) {
		this.snackBar.open(`Error en la actualización de datos. ${error}`, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['error-snack'],
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
