import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InventoryService} from '../../../../../services/inventory/inventory.service';
import {AccountService} from '../../../../../services/account/account.service';
import {User} from '../../../../../models/User';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CurrencyPipe} from '@angular/common';
import {NONE_TYPE} from '@angular/compiler';

@Component({
	selector: 'app-add-budget',
	templateUrl: './add-budget.component.html',
	styleUrls: ['./add-budget.component.scss'],
})
export class AddBudgetComponent implements OnInit {
	user!: User;
	operators: any;
	currencies: any;
	statusQuery: any;
	flagContract: any;
	flagControl: any;

	tax: any;
	taxGeneral: any;
	taxableValue: any;
	taxableValueRRHH: any;
	taxableValueProviders: any;

	taxHR: any;
	taxProviders: any;

	totalBudget: any;

	operatorsSelected: any[] = [];

	inputState: boolean = false;

	public formAddBudget = this._formBuilder.group({
		budget: ['', [Validators.required]],
		budgetHumanResources: ['', [Validators.required]],
		budgetProviders: ['', [Validators.required]],
		operatorsList: ['', [Validators.required]],
		currencyList: ['', [Validators.required]],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<any>,
		private _inventoryService: InventoryService,
		private _accountService: AccountService,
		private _snackBar: MatSnackBar,
		private currencyPipe: CurrencyPipe
	) {}

	closeDialog() {
		this.dialogRef.close();
	}

	ngOnInit(): void {
		this.searchContract(this.data.info.IdContract);
		this.user = this._accountService.userValue;
		this.getSupportOperators();
		this.getCurrency();

		this.formAddBudget.controls['budget'].disable();
	}

	searchContract(IdContract: any) {
		this._inventoryService.searchContract(IdContract).subscribe(res => {
			this.flagContract = res;

			if (this.flagContract.budget.length > 0) {
				this.flagControl = false;
				for (let i = 0; i < this.flagContract.operators.length; i++) {
					this.operatorsSelected.push(this.flagContract.operators[i].IdEngineer);
				}

				this.formAddBudget.setValue({
					budget: [this.currencyPipe.transform(this.flagContract.budget[0].Budget)],
					budgetHumanResources: [
						this.currencyPipe.transform(this.flagContract.budget[0].BudgetHR),
					],
					budgetProviders: [
						this.currencyPipe.transform(this.flagContract.budget[0].BudgetProviders),
					],
					operatorsList: this.operatorsSelected,
					currencyList: this.flagContract.budget[0].IdCurrency,
				});
				this.formAddBudget.disable();
			} else {
				this.flagControl = true;
			}
		});
	}

	onSubmit() {
		this.user = this._accountService.userValue;

		const budget = {
			IdContract: this.data.info.IdContract,
			IdUser: this.user.id,
			Budget: this.valueGeneralBudget,
			Description: 'Esta es la descripcion del presupuesto', //this.formAddBudget.value.operatorsList[0],
			BudgetHR: this.valueBudgetHR,
			BudgetProviders: this.valueBudgetProviders,
			Currency: this.formAddBudget.value.currencyList,
			Engineers: this.formAddBudget.value.operatorsList,
		};
		this._inventoryService.setBudget(budget).subscribe(res => {
			this.statusQuery = res;
			this.statusQuery.length == 0
				? this._snackBar.open('No se pudo generar el presupuesto.', '', {
						duration: 3500,
						verticalPosition: 'top',
						panelClass: ['background-snack-red'],
				  })
				: this._snackBar.open('Presupuesto generado correctamente.', '', {
						duration: 3500,
						verticalPosition: 'top',
						panelClass: ['background-snack-info'],
				  });
		});

		this.closeDialog();
	}

	getSupportOperators() {
		this._inventoryService.getSupportOperators().subscribe(res => {
			this.operators = res;
		});
	}

	getCurrency() {
		this._inventoryService.getCurrency().subscribe(res => {
			this.currencies = res;
		});
	}

	budgetHR: any;
	budgetProviders: any;
	generalBudget: any;

	valueBudgetHR: any;
	valueBudgetProviders: any;
	valueGeneralBudget: any;

	formatCurrency_TaxableValueRRHH(event: any) {
		let value = event.target.value.replace('$', ''); //remove dollar sign
		value = value.replaceAll(',', ''); //remove commas to parse as float
		this.valueBudgetHR = parseFloat(value);
		this.budgetHR = this.currencyPipe.transform(this.valueBudgetHR);
		this.valueGeneralBudget = this.valueBudgetHR + this.valueBudgetProviders;
		this.generalBudget = this.currencyPipe.transform(this.valueGeneralBudget);
		console.log(this.valueGeneralBudget);
	}

	formatCurrency_TaxableValueProviders(event: any) {
		let value = event.target.value.replace('$', ''); //remove dollar sign
		value = value.replaceAll(',', ''); //remove commas to parse as float
		this.valueBudgetProviders = parseFloat(value);
		this.budgetProviders = this.currencyPipe.transform(this.valueBudgetProviders);
		this.valueGeneralBudget = this.valueBudgetHR + this.valueBudgetProviders;
		this.generalBudget = this.currencyPipe.transform(this.valueGeneralBudget);

		console.log(this.valueGeneralBudget);
	}
}
