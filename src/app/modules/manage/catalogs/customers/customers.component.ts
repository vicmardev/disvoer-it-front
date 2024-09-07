import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {ClientService} from 'src/app/services/client/client.service';
import {result} from 'lodash';
import {AddCustomerComponent} from '../dialogs/add-customer/add-customer.component';
import {DeleteCustomerComponent} from '../dialogs/delete-customer/delete-customer.component';
import {EditCustomerComponent} from '../dialogs/edit-customer/edit-customer.component';

@Component({
	selector: 'app-customers',
	templateUrl: './customers.component.html',
	styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
	ordersList: any;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
	selectedRowIndex: number = -1;
	rowSelect: any;

	displayedColumns: string[] = [
		'Nombre',
		'Familia',
		'RazonSocial',
		'DomicilioFiscal',
		'rfc',
		'OrdenCompra',
		'FechaRegistro',
		'Acciones',
	];

	constructor(private clientService: ClientService, public dialog: MatDialog) {}

	ngOnInit(): void {
		this.getClientsList();
	}
	ngAfterViewInit() {
		setTimeout(() => {
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}

	getClientsList() {
		this.clientService.getClientsList().subscribe(result => {
			this.ordersList = result;
			this.dataSource.data = this.ordersList;
			return this.dataSource;
		});
	}

	openDialog() {
		const dialogRef = this.dialog.open(AddCustomerComponent, {
			width: 'auto',
			height: 'auto',
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getClientsList();

			console.log(`Dialog result: ${result}`);
		});
	}

	deleteClient(client: any) {
		const dialogRef = this.dialog.open(DeleteCustomerComponent, {
			width: 'auto',
			height: 'auto',
			data: {
				info: client,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getClientsList();
		});
	}

	editClient(brand: any) {
		const dialogRef = this.dialog.open(EditCustomerComponent, {
			width: 'auto',
			height: 'auto',
			data: {
				info: brand,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getClientsList();
		});
	}
}
