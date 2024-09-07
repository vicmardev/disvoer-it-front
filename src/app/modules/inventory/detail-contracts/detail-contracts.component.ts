import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {InventoryService} from '../../../services/inventory/inventory.service';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';
import {EngineersComponent} from './dialogs/engineers/engineers.component';
import {CurrencyPipe} from '@angular/common';

@Component({
	selector: 'app-detail-contracts',
	templateUrl: './detail-contracts.component.html',
	styleUrls: ['./detail-contracts.component.scss'],
})
export class DetailContractsComponent implements OnInit {
	dataSource!: MatTableDataSource<any>;
	budgetData: any = [];
	flagRow: boolean = false;

	columnsToDisplay = [
		'Contract',
		'Clients',
		'Alias',
		'Status',
		'CurrencyCode',
		'BudgetHR',
		'BudgetProviders',
		'Budget',
		'Ingenieros',
	];

	constructor(
		private _inventoryService: InventoryService,
		iconRegistry: MatIconRegistry,
		sanitizer: DomSanitizer,
		public dialog: MatDialog,
		private currencyPipe: CurrencyPipe
	) {
		iconRegistry.addSvgIcon(
			'user-icon',
			sanitizer.bypassSecurityTrustResourceUrl('assets/icons/Usuarios.svg')
		);
	}

	ngOnInit(): void {
		this.getContractDetails();
	}

	getContractDetails() {
		this._inventoryService.getContractDetails().subscribe(res => {
			// console.log(res);
			this.budgetData = res;
			let aux = this.budgetData.data;

			if (aux.length > 0) {
				this.budgetData = this.budgetData.data;
				for (let i = 0; i < this.budgetData.length; i++) {
					this.budgetData[i].Budget = this.currencyPipe.transform(
						this.budgetData[i].Budget
					);
					this.budgetData[i].BudgetHR = this.currencyPipe.transform(
						this.budgetData[i].BudgetHR
					);
					this.budgetData[i].BudgetProviders = this.currencyPipe.transform(
						this.budgetData[i].BudgetProviders
					);
				}
				this.dataSource = new MatTableDataSource(this.budgetData);
			} else {
				console.log(this.budgetData.msg);
			}
		});
	}

	openDialogEngineers(element: any, index: number) {
		this.flagRow = true;
		const dialogRef = this.dialog.open(EngineersComponent, {
			width: '15%',
			height: 'auto',
			data: {
				info: element,
			},
		});
		dialogRef.afterClosed().subscribe(result => {});
	}
}
