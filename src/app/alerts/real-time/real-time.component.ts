import {Component, OnInit, ViewChild, OnDestroy, Inject} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ReportsService} from 'src/app/services/reports/reports.service';
import {Report} from 'src/app/models/Report';
import {MatSnackBar} from '@angular/material/snack-bar';
import {trigger, state, style, transition, animate} from '@angular/animations';

import {Alarm} from 'src/app/models/alarm';
import {DOCUMENT} from '@angular/common';
import {BehaviorSubject, of, Subject, timer} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CreateTicketInventoryComponent} from 'src/app/pages/dialogs/create-ticket-inventory/create-ticket-inventory.component';
import {CreateTicketAlertComponent} from 'src/app/pages/dialogs/tickets/create-ticket-alert/create-ticket-alert.component';
import {Router} from '@angular/router';
import {Host} from 'src/app/models/host';
import {FormControl, Validators} from '@angular/forms';
import {NONE_TYPE} from '@angular/compiler';

@Component({
	selector: 'app-real-time',
	templateUrl: './real-time.component.html',
	styleUrls: ['./real-time.component.scss'],
})
export class RealTimeComponent implements OnInit, OnDestroy {
	hostList!: Host[];
	intervalCount: any;
	lastUpdate: any;
	seconds = 40;
	filteredHostList!: Host[];
	updateAlarmInfo = false;
	/* table  */
	public dataAlarms = new MatTableDataSource<Alarm>();
	@ViewChild(MatPaginator) paginatorAlarm!: MatPaginator;

	paginatorConfig = {
		length: 13,
		pageSize: 2,
		$values: of(this.filteredHostList),
	};

	pageEvent!: PageEvent;

	private hostAlarmSub: any;
	highLightOn = false;
	selectedRow: any;
	dataReady = false;
	updateCharts = false;

	selectedHostList!: Host[];
	public hosts: FormControl = new FormControl([Validators.required]);

	constructor(private _reportService: ReportsService, private _snackBar: MatSnackBar) {
		this.getAllAlarms();
	}

	ngOnInit(): void {
		this.decremetTime();
		this.getHosts();
	}

	ngAfterViewInit(): void {
		setTimeout(() => (this.dataAlarms.paginator = this.paginatorAlarm));
	}

	/* all  function  first load */
	getAllAlarms() {
		this.decremetTime();
		this.updateCharts = !this.updateCharts;
		this.lastUpdate = this.formatDateNow();
	}

	getHosts() {
		const paginationQuery = [{name: 'services', value: 'false'}];
		this.hostAlarmSub = this._reportService
			.getQueriedHostServices(paginationQuery)
			.subscribe((hostList: any) => {
				console.log('hosts', hostList);
				this.paginatorConfig.length = hostList.length;
				this.lastUpdate = this.formatDateNow();
				this.hostList = hostList;
				this.filteredHostList = hostList;
				this.paginatorConfig.$values = of(hostList);
				this.dataReady = true;
			});
	}

	formatDateNow() {
		var date = new Date();
		// Determine if it is AM or PM
		var amOrPm = date.getHours() >= 12 ? ' PM' : ' AM';
		return (
			('0' + ((date.getHours() % 13) + 1)).slice(-2) +
			':' +
			('0' + date.getMinutes()).slice(-2) +
			':' +
			('0' + date.getSeconds()).slice(-2) +
			amOrPm
		);
	}
	ngOnDestroy() {
		this.hostAlarmSub.unsubscribe();
		if (this.intervalCount) {
			clearInterval(this.intervalCount);
		}
	}

	decremetTime() {
		let n = 40;
		if (this.intervalCount) clearInterval(this.intervalCount);
		this.intervalCount = setInterval(() => {
			this.seconds = n--;
			if (n === 0) {
				n = 40;
			}
		}, 1000);
	}

	filtrar(event: Event) {
		console.log(event);

		const filtro = (event.target as HTMLInputElement).value;
		const processedFilter = filtro.trim().toLowerCase();
		this.filteredHostList = this.hostList.filter(host =>
			host.Hostname.trim().toLowerCase().includes(processedFilter)
		);
		this.dataAlarms.filter = filtro.trim().toLowerCase();

		filtro === '' || filtro.length === 0
			? ''
			: this._snackBar.open(`Existen ${this.filteredHostList.length} registros.`, '', {
					duration: 3500,
					verticalPosition: 'top',
					/* horizontalPosition: 'center', */
					panelClass: ['background-snack-info'],
			  });
	}

	filter(hostsFilter: string[]) {
		if (hostsFilter.length === 0) this.filteredHostList = this.hostList;
		else
			this.filteredHostList = this.hostList.filter((host: Host) =>
				hostsFilter.includes(host.Hostname)
			);
		this.paginatorConfig.$values = of(this.filteredHostList);
	}

	pageEventHandler(event: any) {
		this.pageEvent = event;
		console.log('page event', this.pageEvent, this.paginatorConfig);
		this.getHosts();
	}
}
