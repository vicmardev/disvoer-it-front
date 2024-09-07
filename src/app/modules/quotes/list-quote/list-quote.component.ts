import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {ThirdPartyDraggable} from '@fullcalendar/interaction';
import {first} from 'rxjs/operators';
import {Quote} from 'src/app/models/quote';
import {selectorValue} from 'src/app/models/selector-value';
import {AccountService} from 'src/app/services/account/account.service';
import {QuoteService} from 'src/app/services/quotes/quote.service';
import {AddEditQuoteComponent} from './dialogs/add-edit-quote/add-edit-quote.component';
import {DeleteQuoteComponent} from './dialogs/delete-quote/delete-quote.component';

interface IHeaders {
	customer: string;
	quote: string;
	status: string;
}

@Component({
	selector: 'app-list-quote',
	templateUrl: './list-quote.component.html',
	styleUrls: ['./list-quote.component.scss'],
})
export class ListQuoteComponent implements OnInit {
	highLightOn = false;
	public dataSource = new MatTableDataSource<Quote>();
	public filterdDataSource = new MatTableDataSource<Quote>();
	quoteList!: Quote[];
	selectedQuote!: Quote;
	quoteFilter: string = '';
	defaultValue = 'All';
	quoteFilters: any;
	filterDictionary = new Map<string, string>();
	selectors: IHeaders = {
		customer: 'All',
		quote: 'All',
		status: 'All',
	};
	public filterApplied = false;

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	displayedColumns = [
		'Folio',
		'Customer',
		'Quote',
		'Lead',
		// 'Currency',
		// 'Subtotal',
		// 'IVA',
		'Total',
		'Status',
		'Remark',
		'Acciones',
	];

	constructor(
		private quoteService: QuoteService,
		public dialog: MatDialog,
		private accountService: AccountService,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.getAllQuotes();

		this.dataSource.filterPredicate = function (record, filter) {
			var map = new Map(JSON.parse(filter));
			let isMatch = false;
			for (let [key, value] of map) {
				isMatch =
					value == 'All' || record[key as keyof Quote] == value || key == 'SearchBar';
				if (!isMatch) return false;
			}
			return isMatch;
		};
	}

	ngAfterViewInit(): void {
		setTimeout(() => (this.dataSource.paginator = this.paginator));
	}

	getFilters() {
		this.quoteFilters = {};

		const customerSelect = this.getCustomerSelect();
		const quoteSelect = this.getQuoteSelect();
		const leadSelect = this.getLeadSelect();
		const statusSelect = this.getStatusSelect();

		this.quoteFilters.Customers = {
			name: 'CustomerName',
			values: customerSelect,
			defaultValue: this.defaultValue,
		};
		this.quoteFilters.QuoteStatus = {
			name: 'QuoteStatus',
			values: quoteSelect,
			defaultValue: this.defaultValue,
		};
		this.quoteFilters.Status = {
			name: 'Status',
			values: statusSelect,
			defaultValue: this.defaultValue,
		};
		this.quoteFilters.Lead = {
			name: 'Lead',
			values: leadSelect,
			defaultValue: this.defaultValue,
		};
	}

	getCustomerSelect(): selectorValue[] {
		const customerSet: any[] = [
			...new Set(this.quoteList.map(quote => quote.CustomerName)),
		];
		const customerSelect: selectorValue[] = [{value: 'All', viewValue: 'Todos'}];
		for (let customerName of customerSet) {
			if (
				customerName != null &&
				customerName != 'NULL' &&
				customerName != 'Null' &&
				customerName != 'null'
			) {
				customerSelect.push({value: customerName, viewValue: customerName});
			}
		}

		return customerSelect;
	}

	getQuoteSelect(): selectorValue[] {
		const quoteSet: any[] = [...new Set(this.quoteList.map(quote => quote.QuoteStatus))];
		const quoteSelect: selectorValue[] = [{value: 'All', viewValue: 'Todos'}];
		for (let quoteStatus of quoteSet) {
			if (quoteStatus != null && quoteStatus != 'NULL' && quoteStatus != 'Null') {
				quoteSelect.push({value: quoteStatus, viewValue: quoteStatus});
			}
		}
		return quoteSelect;
	}

	getLeadSelect(): selectorValue[] {
		const leadSet: any[] = [...new Set(this.quoteList.map(quote => quote.Lead))];
		const leadSelect: selectorValue[] = [{value: 'All', viewValue: 'Todos'}];
		for (let lead of leadSet) {
			if (lead != null && lead != 'NULL' && lead != 'Null') {
				leadSelect.push({value: lead, viewValue: lead});
			}
		}
		return leadSelect;
	}

	getStatusSelect(): selectorValue[] {
		const statusSet: any[] = [...new Set(this.quoteList.map(quote => quote.Status))];
		const statusSelect: selectorValue[] = [{value: 'All', viewValue: 'Todos'}];
		for (let status of statusSet) {
			if (status != null && status != 'NULL' && status != 'Null') {
				statusSelect.push({value: status, viewValue: status});
			}
		}
		return statusSelect;
	}

	applyQuoteFilter(event: any, filter: any) {}

	getAllQuotes() {
		this.quoteService.getAllQuotes().subscribe({
			// 	//implement alert service
			next: (quotes: any) => {
				this.quoteList = quotes;
				this.quoteList?.map(quote => {
					quote.CustomerName = quote?.Customer?.Name;
					quote.QuoteStatus = quote?.StatusQuote?.Status;
				});

				this.getFilters();
				this.dataSource.data = quotes;
				this.clearFilters();
			},
		});
	}
	//TODO: add search bar function to datasource predicate
	filter(event: any) {
		const searchFilter = (event.target as HTMLInputElement).value;
		this.dataSource.filter = searchFilter.trim().toLowerCase();
		this.dataSource.filteredData;
	}
	filterSelects(event: any, filter: any = undefined) {
		this.filterApplied = true;
		this.filterDictionary.set(filter.name, event.value);
		var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));

		this.dataSource.filter = jsonString;

		filter === '' || filter.length === 1
			? ''
			: this._snackBar.open(
					`Existen ${this.dataSource.filteredData.length} registros.`,
					'',
					{
						duration: 3500,
						verticalPosition: 'top',
						/* horizontalPosition: 'center', */
						panelClass: ['background-snack-info'],
					}
			  );
	}

	actionsClick(quote: Quote) {}

	selectQuote(quote: Quote) {}

	//TODO: add filters
	getFilteredQuotes() {}

	addQuoteDialog() {
		const dialogRef = this.dialog.open(AddEditQuoteComponent, {
			width: '40rem',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				type: 'add',
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getAllQuotes();
		});
	}
	updateQuoteDialog(id: number, row: Quote) {
		const dialogRef = this.dialog.open(AddEditQuoteComponent, {
			width: '40rem',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				type: 'update',
				quote: row,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getAllQuotes();
		});
	}

	deleteQuoteDialog(id: number) {
		const dialogRef = this.dialog.open(DeleteQuoteComponent, {
			width: '40rem',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				id: id,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getAllQuotes();
		});
	}

	downloadFile(link: any) {}

	openDialog(quote: Quote | undefined, index: number | undefined, action: string) {
		switch (action) {
			case 'add':
				this.addQuoteDialog();
				break;

			case 'edit':
				if (quote != undefined && index != undefined) {
					this.updateQuoteDialog(index, quote);
				}
				break;

			case 'delete':
				if (index != undefined) {
					this.deleteQuoteDialog(index);
				}
				break;

			default:
				break;
		}
	}

	clearFilters() {
		this.filterApplied = false;
		this.dataSource.filter = '';
		for (let key of Object.keys(this.selectors)) {
			this.selectors[key as keyof IHeaders] = 'All';
		}
	}
}
