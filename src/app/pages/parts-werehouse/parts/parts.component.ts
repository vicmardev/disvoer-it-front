import {Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {AddEditPartComponent} from '../../dialogs/partsWerehouse/add-edit-part/add-edit-part.component';
import {DeletePartComponent} from '../../dialogs/partsWerehouse/delete-part/delete-part.component';
import {EditPartComponent} from '../../dialogs/partsWerehouse/edit-part/edit-part.component';
import {MatDialog} from '@angular/material/dialog';
import {PartsWerehouseService} from 'src/app/services/partsWerehouse/parts-werehouse.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Parts} from 'src/app/models/partsWerehouse';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {viewClassName} from '@angular/compiler';
import {TakePartsComponent} from '../../dialogs/partsWerehouse/take-parts/take-parts.component';

import {animate, state, style, transition, trigger} from '@angular/animations';
import {UploadFileComponent} from '../../dialogs/partsWerehouse/upload-file/upload-file.component';
import {ShowErrorsComponent} from '../../dialogs/partsWerehouse/show-errors/show-errors.component';
import {RegisterIncomingComponent} from '../../dialogs/parts-warehouse/register-incoming/register-incoming.component';
import {ThirdPartyDraggable} from '@fullcalendar/interaction';

@Component({
	selector: 'app-parts',
	templateUrl: './parts.component.html',
	styleUrls: ['./parts.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({height: '0px', minHeight: '0'})),
			state('expanded', style({height: '*'})),
			transition(
				'expanded <=> collapsed',
				animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
			),
		]),
	],
})
export class PartsComponent implements OnInit {
	//highLightOn = false;
	//flagRow = false;
	//selectedRow: any;

	//bandera de cambio - botones
	flag = false;
	flag2 = false;
	tab = false;

	/* flags */
	equipment: boolean = true;
	equipmentTypes: boolean = false;
	racks: boolean = false;
	stores: boolean = false;

	flagRow: boolean = false;
	selectedRow: number = -1;
	highLightOn: boolean = false;
	expandedElement: any = false;
	highLightedRow: boolean = false;
	selectedPart!: Parts;

	@Input() componentParts: any;
	tableInfo: any[] = [];
	listModel: any;
	displayedColumns: string[] = ['brand', 'part', 'model', 'partNumber', 'quantity'];

	//expandedElement: boolean = false;
	panelOpenState: boolean = false;
	statusPart = [
		{value: 'todos', name: 'Todos'},
		{value: 'Activo', name: 'Activo'},
		{value: 'Inactivo', name: 'Inactivo'},
	];

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	dataSource = new MatTableDataSource<Parts>();
	status = '';
	constructor(
		public dialog: MatDialog,
		private _partsWerehouseService: PartsWerehouseService,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.getAllParts();
	}

	ngOnChanges(changes: SimpleChanges): void {}

	openRegisterIncomingPart() {
		const dialogRef = this.dialog.open(RegisterIncomingComponent, {
			width: '40rem',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				info: 'incoming',
			},
		});

		dialogRef.afterClosed().subscribe(res => {
			this.flag = false;
		});
	}

	openRegisterOutgoingPart() {
		const dialogRef = this.dialog.open(RegisterIncomingComponent, {
			width: '40rem',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				info: 'outgoing',
			},
		});

		dialogRef.afterClosed().subscribe(res => {
			this.flag2 = false;
		});
	}

	openDialogUploadFile() {
		const dialogRef = this.dialog.open(UploadFileComponent, {
			width: '430px',
			height: '370px',
			data: {
				info: 'data',
			},
		});

		dialogRef.afterClosed().subscribe(error => {
			if (error) {
				this.openDialogErrorList(error);
			} else {
				this.getAllParts();
			}
		});
	}

	openDialogErrorList(error: any) {
		const dialogErrorList = this.dialog.open(ShowErrorsComponent, {
			width: '80%',
			height: '80%',
			data: {error},
		});
	}

	tableSelectedRow(row: any) {
		this.selectedPart = row;
		this.selectedRow = row.IdPart;
	}

	/* Old functions */

	ngAfterViewInit(): void {
		setTimeout(() => (this.dataSource.paginator = this.paginator));
	}

	filterStatus(selectedValue: any) {
		this.status = selectedValue.value;
		if (selectedValue.value == 'todos') this.getAllParts();
		else this.getByStatus(selectedValue.value);
	}

	getAllParts() {
		this._partsWerehouseService.getAllParts().subscribe((res: any) => {
			this.listModel = res;
			this.tableInfo = res;
			this.dataSource.data = this.tableInfo;
		});
	}
	getByStatus(status: string) {
		this._partsWerehouseService.getPartsByStatus(status).subscribe((res: any) => {
			this.listModel = res;
			this.tableInfo = res;
			this.dataSource.data = this.tableInfo;
			this.filterSnack(this.dataSource.data.length);
		});
	}

	filterSnack(length: number) {
		this._snackBar.open(`Existen ${length} resgistro`, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-info'],
		});
	}

	addPartDialog() {
		const dialogRef = this.dialog.open(AddEditPartComponent, {
			width: '650px',
			height: '600px',
			autoFocus: false,
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getAllParts();
		});
	}

	deletePartDialog(rowInfo: any) {
		const dialogRef = this.dialog.open(DeletePartComponent, {
			width: '470px',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			/*
      data:{
        info: 'test'
      }*/
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getAllParts();
		});
	}

	editPartDialog(rowInfo: any, index: any) {
		const dialogRef = this.dialog.open(EditPartComponent, {
			width: '650px',
			height: '600px',
			autoFocus: false,
			data: {
				info: rowInfo,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getAllParts();
		});
	}

	takePartsDialog(rowInfo: any) {
		const dialogRef = this.dialog.open(TakePartsComponent, {
			width: '650px',
			height: 'auto',
			autoFocus: false,
			data: {
				info: rowInfo,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			if (this.status == 'todos') this.getAllParts();
			else this.getByStatus(this.status);
		});
	}
	/*
  expandRow(element: any){
    this.expandedElement = this.expandedElement === element ? null : element;
    this.panelOpenState = this.expandedElement ? true : false;
    console.log('Test');

  }*/

	singleClick(element: any) {
		if (!this.highLightOn) {
			this.expandedElement = this.expandedElement === element ? null : element;
		}
	}

	////////////////////////////////////////////////////////////////////////////////////

	cambioColor() {
		this.flag = !this.flag;
	}

	cambioColorRojo() {
		this.flag2 = !this.flag2;
	}

	tabChange(valor: number) {
		console.log('valor', valor);
		switch (valor) {
			case 1:
				this.equipment = true;
				this.equipmentTypes = false;
				this.racks = false;
				this.stores = false;
				break;
			case 2:
				this.equipment = false;
				this.equipmentTypes = true;
				this.racks = false;
				this.stores = false;
				break;
			case 3:
				this.equipment = false;
				this.equipmentTypes = false;
				this.racks = true;
				this.stores = false;
				break;
			case 4:
				this.equipment = false;
				this.equipmentTypes = false;
				this.racks = false;
				this.stores = true;
				break;
			default:
				break;
		}

		//this.tab = !this.tab;
	}
}
