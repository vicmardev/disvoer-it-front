import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {selectorValue} from 'src/app/models/selector-value';
import {QuoteService} from 'src/app/services/quotes/quote.service';
import {CurrencyPipe} from '@angular/common';

@Component({
	selector: 'app-add-edit-quote',
	templateUrl: './add-edit-quote.component.html',
	styleUrls: ['./add-edit-quote.component.scss'],
})
export class AddEditQuoteComponent implements OnInit {
	customerSelectorValues!: selectorValue[];
	statusQuoteSelectorValues!: selectorValue[];
	statusSelectorValues!: selectorValue[];
	IVA = 0.16; //percentage value
	total = 0.0;
	currencyCode = 'MXN';
	currencyValues: selectorValue[] = [
		{value: 'MXN', viewValue: 'MXN'},
		{value: 'USD', viewValue: 'USD'},
	];

	submiting = false;

	public quoteForm = this.formBuilder.group({
		IdCustomer: ['', [Validators.required]],
		IdQuote: ['', [Validators.required]],
		Lead: ['', [Validators.required]],
		Currency: ['MXN', [Validators.required]],
		Subtotal: ['', [Validators.required]],
		IVA: ['16', [Validators.required]],
		Total: [{value: '', disabled: true}, [Validators.required]],
		Status: ['', [Validators.required]],
		Folio: ['', [Validators.required]],
		Remark: [''],
		UrlFile: [''],
	});

	get form() {
		return this.quoteForm.controls;
	}

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private quoteService: QuoteService,
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<any>,
		private snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.submiting = true;
		this.quoteService.getSelectors().subscribe({
			next: (selectors: any) => {
				this.customerSelectorValues = selectors.Customers;
				this.statusQuoteSelectorValues = selectors.Quotes;
				this.statusSelectorValues = selectors.Status;
				this.currencyValues = selectors.CurrencyList;
				this.submiting = false;
				if (this.data.type == 'update') {
					this.fillForm();
				}
			},
			error: err => {
				console.log(err);
			},
		});
	}

	fillForm() {
		const quote = this.data.quote;
		for (const control in this.form) {
			console.log(control);
			this.form[control].setValue(quote[control]);
		}
	}
	calculateTotal(event: any) {
		//slide decimal two places (multiply by slide)
		//integer multiplication is not affected bt floating point weirdness
		//to return to good value, divde by slide
		const slide = 10 ** 6;
		let subtotal = this.form.Subtotal.value * slide;
		const iva = (subtotal * this.IVA * slide) / slide;

		this.total = subtotal + iva;
		this.total /= slide;
		subtotal /= slide;

		this.form.Total.setValue(this.total.toString());
		this.form.Subtotal.setValue(subtotal.toString());
	}

	onSubmit() {
		this.form.Total.enable();
		console.log(this.quoteForm.value);

		this.quoteService.createQuote(this.quoteForm.value).subscribe(res => {
			this.cancel();
			this.successSnack();
		});
	}

	cancel() {
		this.dialogRef.close();
	}

	successSnack() {
		this.snackBar.open('Actualización de datos exitosa.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}
}
