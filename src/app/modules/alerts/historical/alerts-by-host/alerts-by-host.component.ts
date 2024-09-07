import {Component, OnInit, Input, ViewChild, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReportsService} from '../../../../services/reports/reports.service';
import {Host} from '../../../../models/host';

@Component({
	selector: 'app-alerts-by-host',
	templateUrl: './alerts-by-host.component.html',
	styleUrls: ['./alerts-by-host.component.scss'],
})
export class AlertsByHostComponent implements OnInit {
	@Input() currentFilter!: Host[];
	@Input() host: any;

	@ViewChild('paginator') paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	public dataSourceAlarms = new MatTableDataSource<any>();

	selectedRowIndexAlarms: number = -1;
	flagSpiner: boolean = false;
	flagTableHistorical: boolean = false;
	tableHistoticAlarmas: any;
	selectedRowIndex: number = -1;

	serviceName: any = '';

	tableReady = false;
	bitacoraFilter: any;
	flagSpinner: boolean = false;
	flagTableAlarms: boolean = false;

	displayColumAlarmHost: string[] = [
		'Hostname',
		'ServiceName',
		'Status',
		/*  'Acknowledged', */
		'Attemps',
		'Duration',
		// 'Notification',
		/*  'PluginOutput', */
	];

	highlightAlarms(row: any) {
		this.selectedRowIndexAlarms = row;
	}

	highlight(row: any) {
		this.selectedRowIndex = row;
	}

	async getAllAlarms(idService: string) {
		this.tableReady = false;
		const res = await this._reportService._getHistorics(idService).toPromise();
		this.bitacoraFilter = res;
		this.tableReady = true;
		this.flagSpinner = false;
	}

	async getTablebitacora(serviceName: string, idService: string) {
		this.flagSpinner = true;
		this.flagTableAlarms = true;
		this.flagTableHistorical = false;

		await this.getAllAlarms(idService);
		this.serviceName = serviceName;
		this.currentFilter = this.bitacoraFilter;
	}

	filltable() {
		this.dataSourceAlarms.data = this.currentFilter;
		this.dataSourceAlarms.data.length == 0
			? this._snackBar.open('No existen registros.', '', {
					duration: 3500,
					verticalPosition: 'top',
					panelClass: ['background-snack-red'],
			  })
			: 0;

		setTimeout(() => (this.dataSourceAlarms.paginator = this.paginator));
	}

	constructor(private _reportService: ReportsService, private _snackBar: MatSnackBar) {}

	ngOnInit(): void {
		this.filltable();
	}

	ngOnChanges(changes: SimpleChanges) {
		this.bitacoraFilter = false;
		this.filltable();
	}
}
