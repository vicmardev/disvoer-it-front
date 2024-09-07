import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {SupportOperatorsService} from 'src/app/services/support-operators/support-operators.service';
import {AddSupportOperatorComponent} from '../dialogs/add-support-operator/add-support-operator/add-support-operator.component';
import {DeleteSupportOperatorComponent} from '../dialogs/delete-support-operator/delete-support-operator.component';
import {EditSupportOperatorComponent} from '../dialogs/edit-support-operator/edit-support-operator.component';

@Component({
	selector: 'app-support-operators',
	templateUrl: './support-operators.component.html',
	styleUrls: ['./support-operators.component.scss'],
})
export class SupportOperatorsComponent implements OnInit {
	ordersList: any;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	dataSource!: MatTableDataSource<any>;
	selectedRowIndex: number = -1;
	rowSelect: any;

	displayedColumns: string[] = ['Nombre', 'Escalación', 'Correo', 'Teléfono', 'Acciones'];

	constructor(
		private SupportOperatorsService: SupportOperatorsService,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.getSupportOperatorList();
	}

	getSupportOperatorList() {
		this.SupportOperatorsService.getSupportOperatorList().subscribe(result => {
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
		const dialogRef = this.dialog.open(AddSupportOperatorComponent, {
			width: '30%',
			height: 'auto',
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

	deleteSupportOperator(client: any) {
		const dialogRef = this.dialog.open(DeleteSupportOperatorComponent, {
			width: 'auto',
			height: 'auto',
			data: {
				info: client,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getSupportOperatorList();
		});
	}

	editOperator(client: any) {
		const dialogRef = this.dialog.open(EditSupportOperatorComponent, {
			width: '30%',
			height: 'auto',
			data: {
				info: client,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getSupportOperatorList();
		});
	}
}
