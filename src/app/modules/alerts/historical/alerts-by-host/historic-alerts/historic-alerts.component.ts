import {Component, OnInit, Input, ViewChild, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Alarm} from '../../../../../models/alarm';

@Component({
	selector: 'app-historic-alerts',
	templateUrl: './historic-alerts.component.html',
	styleUrls: ['./historic-alerts.component.scss'],
})
export class HistoricAlertsComponent implements OnInit {
	@Input() dataSource!: Alarm[];
	@Input() host: any;
	@Input() currentServiceName: any;

	@ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	public dataSourceBitacora = new MatTableDataSource<Alarm>();
	selectedRowIndex: number = -1;

	displayedColumnsBitacora: string[] = [
		'Hostname',
		// 'AlarmType',
		'ServiceName',
		'Status',
		'Time',
		'Duration',
		/*  'PluginOutput',  */
		//'id',
	];

	highlight(row: any) {
		this.selectedRowIndex = row;
	}

	constructor() {}

	filltable() {
		this.dataSourceBitacora.data = this.dataSource;
	}

	ngAfterViewInit() {
		this.dataSourceBitacora.paginator = this.paginator;
	}

	ngOnInit(): void {
		this.filltable();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.dataSource == undefined) return;
		this.dataSourceBitacora.data = changes.dataSource.currentValue;
	}
}
