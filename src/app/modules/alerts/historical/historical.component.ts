import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {ReportsService} from 'src/app/services/reports/reports.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
	selector: 'app-historical',
	templateUrl: './historical.component.html',
	styleUrls: ['./historical.component.scss'],
})
export class HistoricalComponent implements OnInit {
	serviceAlarms: any;
	flagTableAlarms: boolean = false;
	flagTableHistorical: boolean = false;
	currentFilter: any;
	selectedRowIndex: number = -1;
	host: any;
	idService: any;
	tableReady = false;
	flagSpinner: boolean = false;

	/* New vars to get HOSTS */
	private hostAlarmSub: any;
	public hosts: FormControl = new FormControl([Validators.required]);

	/* Filter the list */
	public hostsFilter: FormControl = new FormControl([Validators.required]);

	/* headers  tables */
	displayColumsHost: string[] = ['Hostname', 'Acknowledged', 'Notification', 'Status'];

	opcionSeleccionado: any[] = [];

	public hostsToFilter = new MatTableDataSource<any>();
	public dataSourceHost = new MatTableDataSource<any>();
	public dataSourceAlarms = new MatTableDataSource<any>();

	constructor(private _reportService: ReportsService, private _snackBar: MatSnackBar) {}

	ngOnInit(): void {
		this.getHosts();
	}

	// Filter and First Table
	getHosts() {
		this.hostAlarmSub = this._reportService.getHostServiceAlarms().subscribe(hostList => {
			this.hostsToFilter.data = hostList;
		});
	}

	isOptionDisabled(opt: any): boolean {
		return this.hosts.value.length >= 3 && !this.hosts.value.find((el: any) => el == opt);
	}

	fillTable(opt: any): boolean {
		let hostList = this.isOptionDisabled(opt);
		this.dataSourceHost.data = this.hostsToFilter.data.filter(
			(w: any) =>
				w.Hostname === this.opcionSeleccionado[0] ||
				w.Hostname === this.opcionSeleccionado[1] ||
				w.Hostname === this.opcionSeleccionado[2]
		);
		return hostList;
	}

	//Second table
	async getAllAlarms(idhost: string) {
		this.tableReady = false;
		const res = await this._reportService._getServices(idhost).toPromise();
		this.serviceAlarms = res;

		this.tableReady = true;
		this.flagSpinner = false;
	}

	async tableAlarHost(host: string, idHost: string) {
		this.flagSpinner = true;
		this.flagTableAlarms = true;
		this.flagTableHistorical = false;
		await this.getAllAlarms(idHost);
		this.currentFilter = this.serviceAlarms;
		this.host = host;
		this.dataSourceAlarms.data = this.serviceAlarms;
		this.dataSourceAlarms.data.length == 0
			? this._snackBar.open('No existen registros.', '', {
					duration: 3500,
					verticalPosition: 'top',
					panelClass: ['background-snack-red'],
			  })
			: 0;
	}

	highlight(row: any) {
		this.selectedRowIndex = row;
	}
}
