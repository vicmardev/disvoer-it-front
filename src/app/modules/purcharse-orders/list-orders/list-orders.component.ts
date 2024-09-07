import {Component, OnInit, ViewChild} from '@angular/core';
import {OrderPurchaseService} from 'src/app/services/orderPurchase/order-purchase.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import {MatDialog} from '@angular/material/dialog';
//import {CreateOrderComponent} from '../dialogs/create-order/create-order.component';
import {OrdersPurchase} from 'src/app/models/Orders';
import {environment} from 'src/environments/environment';
import {first} from 'rxjs/operators';
import {CreateOrderComponent} from './dialogs/create-order/create-order.component';
import {EditOrderComponent} from './dialogs/edit-order/edit-order.component';
import {UpdateOrderComponent} from './dialogs/update-order/update-order.component';
import {DeleteOrderComponent} from './dialogs/delete-order/delete-order.component';
import {UpdateListComponent} from './dialogs/update-list/update-list.component';

interface Orders extends OrderPurchaseService {
	Status: String;
	TypePart: String;
	Services: String;
	Brand: String;
}

interface SelectFields {
	Status: String;
	TypePart: String;
	Services: String;
	Brand: String;
}

@Component({
	selector: 'app-list-orders',
	templateUrl: './list-orders.component.html',
	styleUrls: ['./list-orders.component.scss'],
})
export class ListOrdersComponent implements OnInit {
	ordersList: any;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	public uniqueStatus: Set<String> = new Set();
	public uniqueTypePart: Set<String> = new Set();
	public uniqueServices: Set<String> = new Set();
	public uniqueBrand: Set<String | null> = new Set();
	@ViewChild(MatSort) sort!: MatSort;
	public filters = new Map();
	//public dataSource!: new MatTableDataSource<Orders>();
	public dataSource = new MatTableDataSource<Orders>();
	public tableData: Orders[] = [];
	selectedRowIndex: number = -1;
	rowSelect: any;
	idTicketSelect: string = '';
	phaseTicket: number = 0;
	flagDivComponet: boolean = false;
	pathURL: any = `${environment.apiUrl}/order-purchase?filePath=`;
	displayedColumns: string[] = [
		'Numero de Orden',
		'Fecha de recepcion',
		'Estatus',
		'Usuario',
		'Usuario final',
		'Empresa duena',
		'Tipo de equipo',
		'Marca',
		'Servicio',
		'Total de equipos',
		'Acciones',
	];
	public selectFields: SelectFields = {
		Status: '',
		TypePart: '',
		Services: '',
		Brand: '',
	};

	pdfSrc: string = '';
	pdfAvailable: boolean = false;
	public filterApplied = false;
	constructor(
		private orderService: OrderPurchaseService,
		public dialog: MatDialog,
		private _matSnackBar: MatSnackBar
	) {
		this.loadOrdersData();
	}

	ngOnInit(): void {
		this.getAllOrdes();
	}
	ngOnChanges(): void {
		this.getAllOrdes();
	}

	private async loadOrdersData() {
		const ordersResult: any = await this.orderService.getAllOrder().toPromise();
		this.tableData = ordersResult as Orders[];
		console.log('Valor de tableData: ', this.tableData);

		this.getUniqueStatus(this.tableData);
		this.getuniqueBrand(this.tableData);
		this.getuniqueService(this.tableData);
		this.getuniqueTypePart(this.tableData);
	}

	getAllOrdes() {
		this.orderService.getAllOrder().subscribe(result => {
			this.ordersList = result;
			this.dataSource = new MatTableDataSource(this.ordersList);
			setTimeout(() => {
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			});
			return this.dataSource;
		});
	}

	openDialog() {
		const dialogRef = this.dialog.open(CreateOrderComponent, {
			width: '1100px',
			height: '550px',
		});
		dialogRef.afterClosed().subscribe(() => {
			setTimeout(() => {
				this.orderService.getAllOrder().subscribe(result => {
					this.ordersList = result;
					this.dataSource = new MatTableDataSource(this.ordersList);
					setTimeout(() => {
						this.dataSource.paginator = this.paginator;
						this.dataSource.sort = this.sort;
					});
					return this.dataSource;
				});
			}, 2000);
		});
	}

	editOrder(element: any) {
		const dialogRef = this.dialog.open(EditOrderComponent, {
			width: '1100px',
			height: '500px',
			data: {
				info: element,
			},
		});
		dialogRef.afterClosed().subscribe(() => {
			this.orderService.getAllOrder().subscribe(result => {
				this.ordersList = result;
				this.dataSource = new MatTableDataSource(this.ordersList);
				setTimeout(() => {
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
				});
				return this.dataSource;
			});
		});
	}

	updateOrder(element: any) {
		const dialogRef = this.dialog.open(UpdateOrderComponent, {
			width: '1100px',
			height: '430px',
			data: {
				info: element,
			},
		});
		dialogRef.afterClosed().subscribe(() => {
			this.orderService.getAllOrder().subscribe(result => {
				this.ordersList = result;
				this.dataSource = new MatTableDataSource(this.ordersList);
				setTimeout(() => {
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
				});
				return this.dataSource;
			});
		});
	}

	deleteOrder(element: any) {
		const dialogRef = this.dialog.open(DeleteOrderComponent, {
			width: '400px',
			height: '180px',
			data: {
				info: element,
			},
		});
		dialogRef.afterClosed().subscribe(() => {
			this.orderService.getAllOrder().subscribe(result => {
				this.ordersList = result;
				this.dataSource.data = this.ordersList;
				console.log(result);
			});
		});
	}

	updateList(element: any) {
		const diralogRef = this.dialog.open(UpdateListComponent, {
			width: '1100px',
			height: '550px',
			data: {
				info: element,
			},
		});
	}

	highlight(row: any) {
		this.selectedRowIndex = row;
	}

	getUniqueId(row: any) {
		let url: string = this.pathURL + row.UrlOrderFile;
		var configuracion_ventana =
			'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
		window.open(url, '_blank', configuracion_ventana);
		this.flagDivComponet = false;
		this.rowSelect = '';
		this.idTicketSelect = row.ticketID;
		this.rowSelect = row;
		this.flagDivComponet = true;
		console.log(this.rowSelect);
		this.phaseTicket = this.rowSelect;
		console.log('El valor del paso del ticket es', this.phaseTicket);
	}

	//Download contract on zip file
	generateContract(element: any) {
		if (element.pathZip === '') {
			this.snackMessageWarn('Error en la descarga');
		} else {
			this.snackMessageOk('Descarga exitosa');
		}
	}

	generatePDF(file: any) {
		const filePath = file.UrlOrderFile;
		if (filePath) {
			this.orderService
				.getFile(filePath)
				.pipe(first())
				.subscribe((res: any) => {
					let file = new Blob([res], {type: 'application/pdf'});
					this.pdfSrc = URL.createObjectURL(file);
					window.open(this.pdfSrc, '_blank');
					this.pdfAvailable = true;
				});
		}
	}

	clearFilter() {
		this.filterApplied = false;
		for (let [key, value] of this.filters) {
			this.filters.set(key, 'ALL');
			this.selectFields[key as keyof SelectFields] = '';
		}
		this.dataSource.data = this.tableData;
		this.snackMessageOk('Filtros eliminados');
	}

	filtrar(event: any) {
		const filter = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filter.trim().toLocaleLowerCase();
		filter === '' || filter.length === 1
			? ''
			: this.snackMessageOk(`${this.dataSource.filteredData.length} registros`);
	}

	filterSelect(event: any, filterName: String) {
		this.filterApplied = true;
		this.filters.set(filterName, event.value);
		this.dataSource.data = this.tableData;
		const searchResult = this.tableData.filter(order => {
			let isMatch = new Array();
			for (let [key, value] of this.filters) {
				isMatch.push(value === 'ALL' || order[key as keyof Orders] === value);
			}
			return !isMatch.includes(false);
		});
		this.dataSource.data = searchResult;
		this.showFilterResults(searchResult.length);
	}

	private showFilterResults(numResults: number) {
		this.showSnackbar(
			`Existen ${numResults} registros`,
			numResults > 0 ? 'message' : 'error'
		);
	}

	private getUniqueStatus(orderList: Orders[]) {
		orderList.map((order: Orders) => this.uniqueStatus.add(order.Status));
	}

	private getuniqueBrand(orderList: Orders[]) {
		orderList.map((order: Orders) => this.uniqueBrand.add(order.Brand));
	}
	private getuniqueService(orderList: Orders[]) {
		orderList.map((order: Orders) => this.uniqueServices.add(order.Services));
	}

	private getuniqueTypePart(orderList: Orders[]) {
		orderList.map((order: Orders) => this.uniqueTypePart.add(order.TypePart));
	}

	private showSnackbar(msg: string, type: string = 'message') {
		this._matSnackBar.open(msg, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: [type === 'message' ? 'background-snack-info' : 'background-snack-red'],
		});
	}

	snackMessageWarn(msg: any) {
		this._matSnackBar.open(msg, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-red'],
		});
	}

	snackMessageOk(msg: any) {
		this._matSnackBar.open(msg, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-info'],
		});
	}
}
