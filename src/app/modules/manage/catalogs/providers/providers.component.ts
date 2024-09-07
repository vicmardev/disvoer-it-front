import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {ProvidersService} from 'src/app/services/providers/providers.service';
import {AddProviderComponent} from '../dialogs/add-provider/add-provider.component';
import {DeleteProviderComponent} from '../dialogs/delete-provider/delete-provider.component';
import {EditProviderComponent} from '../dialogs/edit-provider/edit-provider.component';
@Component({
	selector: 'app-providers',
	templateUrl: './providers.component.html',
	styleUrls: ['./providers.component.scss'],
})
export class ProvidersComponent implements OnInit {
	orderList: any;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	dataSource!: MatTableDataSource<any>;
	selectedRowIndex: number = -1;
	rowSelect: any;
	displayedColumns: string[] = [
		'Name',
		'NameContact',
		'PhoneContact',
		'EmailContact',
		'City',
		'Country',
		'Delegation',
		'PostalCode',
		'InternalNumber',
		'ExternalNumber',
		'Comments',
		'createdAt',
		'Accions',
	];

	constructor(private _providerService: ProvidersService, public dialog: MatDialog) {}

	ngOnInit(): void {
		this.getProvidersList();
	}

	getProvidersList() {
		this._providerService.getProvidersList().subscribe(result => {
			this.orderList = result;
			this.dataSource = new MatTableDataSource(this.orderList);
			setTimeout(() => {
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			});
			return this.dataSource;
		});
	}

	/* Add provider */
	openDialog() {
		const dialogRef = this.dialog.open(AddProviderComponent, {
			width: 'auto',
			height: 'auto',
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

	deleteProvider(provider: any) {
		const dialogRef = this.dialog.open(DeleteProviderComponent, {
			width: 'auto',
			height: 'auto',
			data: {
				info: provider,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getProvidersList();
		});
	}

	editProvider(provider: any) {
		const dialogRef = this.dialog.open(EditProviderComponent, {
			width: 'auto',
			height: 'auto',
			data: {
				info: provider,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getProvidersList();
		});
	}
}
