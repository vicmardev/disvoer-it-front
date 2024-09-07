import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {
	ApexAxisChartSeries,
	ApexChart,
	ApexTitleSubtitle,
	ApexXAxis,
	ChartComponent,
} from 'ng-apexcharts';
import {BehaviorSubject} from 'rxjs';
import {Alarm} from 'src/app/models/alarm';
import {selectorValue} from 'src/app/models/selector-value';
import {CreateTicketAlertComponent} from 'src/app/pages/dialogs/tickets/create-ticket-alert/create-ticket-alert.component';
import {ReportsService} from 'src/app/services/reports/reports.service';

export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	title: ApexTitleSubtitle;
	colors: string[];
};

interface IHeaders {
	hosts: string;
	components: string;
	status: string;
}
@Component({
	selector: 'app-graphics',
	templateUrl: './graphics.component.html',
	styleUrls: ['./graphics.component.scss'],
})
export class GraphicsComponent implements OnInit {
	displayAlarmColumns: string[] = [
		/*  'Acknowledged', */
		'Hostname',
		'ServiceName',
		'Status',
		'Duration',
		'Created',
		'Notification',
		'Attemps',
		'Service',
		/* 'Serial', */
		/*  'PluginOutput', */
	];
	alarmCount = {
		ok: 0,
		warning: 0,
		critical: 0,
		unknown: 0,
		total: 0,
	};
	serviceAlarms!: any;
	flagAlarm: boolean = false;
	typeFilterAlarm: string = '';
	intervalCount: any;
	lastUpdate: any;
	flagTotal: boolean = false;
	seconds = 40;
	titleTable: string = '';
	alarmFilters: any;
	defaultValue = 'All';
	filterDictionary = new Map<string, string>();
	selectors = {hosts: 'All', components: 'All', status: 'All'};
	filterApplied = false;

	/* table  */
	public dataAlarms = new MatTableDataSource<Alarm>();
	@ViewChild(MatPaginator) paginatorAlarm!: MatPaginator;

	/* graphics  containers */
	@ViewChild('alarmOk') chartOk!: ChartComponent;
	public chartOptionsOk!: Partial<ChartOptions> | any;
	@ViewChild('alarmWarning') chartwarning!: ChartComponent | any;
	public chartOptionsWarning!: Partial<ChartOptions> | any;
	@ViewChild('alarmDanger') chartDanger!: ChartComponent | any;
	public chartOptionsDanger!: Partial<ChartOptions> | any;
	@ViewChild('alarmTotal') chartTotal!: ChartComponent | any;
	public chartOptionsTotal!: Partial<ChartOptions> | any;
	public okAlarms: BehaviorSubject<any> = new BehaviorSubject(0);
	public critAlarms: BehaviorSubject<any> = new BehaviorSubject(0);
	public warnAlarms: BehaviorSubject<any> = new BehaviorSubject(0);
	public unknownAlarms: BehaviorSubject<any> = new BehaviorSubject(0);
	allpie = [this.okAlarms.value, this.warnAlarms.value, this.critAlarms.value];
	private alarmSub: any;
	private currentStatus = '';
	highLightOn = false;
	selectedRow: any;

	constructor(
		private _reportService: ReportsService,
		private _snackBar: MatSnackBar,
		private dialog: MatDialog,
		private _router: Router
	) {
		this.getAllAlarms();
	}

	ngOnInit(): void {
		this.decremetTime();
		this.countAlarms();
		this.setFilterPredicate();
	}

	ngAfterViewInit(): void {
		setTimeout(() => (this.dataAlarms.paginator = this.paginatorAlarm));
	}

	/* all  function  first load */
	getAllAlarms() {
		this.getServiceAlarms();
		this.decremetTime();
		console.log('click');
		this.lastUpdate = this.formatDateNow();
	}

	getServiceAlarms() {
		this.alarmSub = this._reportService.getServiceAlarms().subscribe(res => {
			this.serviceAlarms = res;
			this.getFilters();

			this.serviceAlarms = this.sortalarms(this.serviceAlarms);

			this.makeTableAlert(this.currentStatus);
			this.lastUpdate = this.formatDateNow();

			this.alarmCount.ok = this.serviceAlarms.filter(
				(w: any) => w.Status === 'ok'
			).length;
			this.okAlarms.next(this.alarmCount.ok);

			this.alarmCount.warning = this.serviceAlarms.filter(
				(w: any) => w.Status === 'warning'
			).length;
			this.warnAlarms.next(this.alarmCount.warning);

			this.alarmCount.critical = this.serviceAlarms.filter(
				(c: any) => c.Status === 'critical' || c.Status === 'unknown'
			).length;
			this.critAlarms.next(this.alarmCount.critical);

			this.alarmCount.unknown = this.serviceAlarms.filter(
				(u: any) => u.Status === 'unknown'
			).length;
			this.unknownAlarms.next(this.alarmCount.unknown);
			this.seconds--;
			if (this.seconds === 0) {
				this.seconds = 40;
			}
			// this.countAlarms();
			this.updateAlarmCount();
			// this.chartOk.updateOptions(this.chartOptionsOk)
		});
	}

	sortalarms(serviceArray: any) {
		serviceArray.sort(
			(a: any, b: any) => a.DurationObject.seconds - b.DurationObject.seconds
		);
		serviceArray.sort(
			(a: any, b: any) => a.DurationObject.minutes - b.DurationObject.minutes
		);
		serviceArray.sort(
			(a: any, b: any) => a.DurationObject.hours - b.DurationObject.hours
		);
		serviceArray.sort((a: any, b: any) => a.DurationObject.days - b.DurationObject.days);
		return serviceArray;
	}

	updateAlarmCount() {
		this.alarmCount.total =
			this.okAlarms.value + this.warnAlarms.value + this.critAlarms.value;

		this.chartOk.updateOptions({
			title: {
				text: `Alarmas: ${this.okAlarms.value}`,
			},
		});
		const okData = parseFloat(
			((this.okAlarms.value / this.alarmCount.total) * 100).toFixed(2)
		);
		this.chartOk.updateSeries([okData]);

		this.chartwarning.updateOptions({
			title: {
				text: `Alarmas: ${this.warnAlarms.value}`,
			},
		});
		const warnData = parseFloat(
			((this.warnAlarms.value / this.alarmCount.total) * 100).toFixed(2)
		);
		this.chartwarning.updateSeries([warnData]);

		this.chartDanger.updateOptions({
			title: {
				text: `Alarmas: ${this.critAlarms.value}`,
			},
		});
		const critData = parseFloat(
			((this.critAlarms.value / this.alarmCount.total) * 100).toFixed(2)
		);
		this.chartDanger.updateSeries([critData]);

		this.allpie = [this.okAlarms.value, this.warnAlarms.value, this.critAlarms.value];
		this.chartTotal.updateOptions({
			title: {
				text: `Total de alarmas : ${this.alarmCount.total}`,
			},
		});
		this.chartTotal.updateSeries(this.allpie);

		this._snackBar.open(`Actualizando información.`, '', {
			duration: 3500,
			verticalPosition: 'bottom',
			/* horizontalPosition: 'center', */
			panelClass: ['background-snack-info'],
		});
	}

	countAlarms() {
		this.chartOptionsOk = {
			colors: ['#33db9ec4'],
			series: [0],
			chart: {
				height: 320,
				type: 'radialBar',
				dropShadow: {
					enabled: true,
					enabledOnSeries: false,
					top: 8,
					left: 1,
					blur: 3,
					color: ['#000'],
					opacity: 0.35,
				},
			},
			title: {
				text: `Alarmas: ${this.okAlarms.value}`,
				align: 'center',
				style: {
					fontSize: '18px',
					color: '#33db9ec4',
				},
			},
			labels: [`OK`],
			responsive: [
				{
					breakpoint: 350,
					options: {
						chart: {
							width: 250,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		};

		this.chartOptionsWarning = {
			colors: ['#ff8a65ab'],
			series: [0],
			chart: {
				height: 320,
				type: 'radialBar',
				dropShadow: {
					enabled: true,
					enabledOnSeries: false,
					top: 8,
					left: 1,
					blur: 3,
					color: ['#000'],
					opacity: 0.35,
				},
			},
			labels: [`Warning`],
			title: {
				text: `Alarmas: ${this.warnAlarms.value}`,
				align: 'center',
				style: {
					fontSize: '18px',
					color: '#ff8a65ab',
				},
			},
			responsive: [
				{
					breakpoint: 350,
					options: {
						chart: {
							width: 250,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		};

		this.chartOptionsDanger = {
			colors: ['#f0466b9e'],
			series: [0],
			chart: {
				height: 320,
				type: 'radialBar',
				dropShadow: {
					enabled: true,
					enabledOnSeries: false,
					top: 8,
					left: 1,
					blur: 3,
					color: ['#000'],
					opacity: 0.35,
				},
			},
			labels: [`Critical`],
			title: {
				text: `Alarmas: ${this.critAlarms.value}`,
				align: 'center',
				style: {
					fontSize: '18px',
					color: '#f0466b9e',
				},
			},
			responsive: [
				{
					breakpoint: 350,
					options: {
						chart: {
							width: 250,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		};

		this.chartOptionsTotal = {
			colors: ['#33db9ec4', '#ff8a65ab', '#f0466b9e'],
			series: this.allpie,
			chart: {
				width: '135%',
				height: 320,
				type: 'donut',
				dropShadow: {
					enabled: true,
					enabledOnSeries: false,
					top: 8,
					left: 1,
					blur: 3,
					color: ['#000'],
					opacity: 0.35,
				},
			},
			title: {
				text: `Total de alarmas : ${this.alarmCount.total}`,
				align: 'left',
				style: {
					fontSize: '18px',
					color: '#0099CC',
				},
			},

			stroke: {
				width: 0,
			},

			labels: [`Correcto `, `Advertencia `, `Peligroso`],
			theme: {
				monochrome: {
					enabled: true,
				},
			},

			responsive: [
				{
					breakpoint: 350,
					options: {
						chart: {
							width: 250,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		};

		this._snackBar.open(`Actualizando información.`, '', {
			duration: 3500,
			verticalPosition: 'bottom',
			/* horizontalPosition: 'center', */
			panelClass: ['background-snack-info'],
		});
	}

	makeTableAlert(status: string) {
		this.currentStatus = status;
		if (status === '') {
			this.flagAlarm = true;
			this.flagTotal = true;
			this.dataAlarms.data = this.serviceAlarms;
			setTimeout(() => (this.dataAlarms.paginator = this.paginatorAlarm));
			this.titleTable = 'Todas las alertas';
		} else {
			this.flagAlarm = true;
			this.flagTotal = false;
			this.typeFilterAlarm = status;
			const listAlarm = this.serviceAlarms.filter((w: any) => w.Status === status);
			if (status == 'critical') {
				const listAlarm = this.serviceAlarms.filter(
					(w: any) => w.Status === status || w.Status === 'unknown'
				);
				this.dataAlarms.data = this.sortalarms(listAlarm);
			} else {
				const listAlarm = this.serviceAlarms.filter((w: any) => w.Status === status);
				this.dataAlarms.data = this.sortalarms(listAlarm);
			}
			setTimeout(() => (this.dataAlarms.paginator = this.paginatorAlarm));
			switch (status) {
				case 'ok':
					this.titleTable = 'Alertas Correctas';
					break;
				case 'warning':
					this.titleTable = 'Alertas Advetencia';
					break;
				case 'critical':
					this.titleTable = 'Alertas Peligrosas';
					break;
				default:
					break;
			}
		}
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
		this.alarmSub.unsubscribe();
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

	clearAlarm(row: any) {
		switch (row.Status) {
			case 'warning':
				this.warnAlarms.next(this.warnAlarms.value - 1);
				this.okAlarms.next(this.okAlarms.value + 1);
				break;
			case 'critical':
				this.critAlarms.next(this.critAlarms.value - 1);
				this.okAlarms.next(this.okAlarms.value + 1);
				break;
			default:
				break;
		}
		console.log(row);
		row.Status = 'ok';
		this.updateAlarmCount();
	}

	openDialogTicket(rowInfo: any) {
		const dialogRef = this.dialog.open(CreateTicketAlertComponent, {
			width: 'auto',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				info: rowInfo,
			},
		});
	}

	filtrar(event: Event) {
		const filtro = (event.target as HTMLInputElement).value;
		this.dataAlarms.filter = filtro.trim().toLowerCase();
		filtro === '' || filtro.length === 1
			? ''
			: this._snackBar.open(
					`Existen ${this.dataAlarms.filteredData.length} registros.`,
					'',
					{
						duration: 3500,
						verticalPosition: 'top',
						/* horizontalPosition: 'center', */
						panelClass: ['background-snack-info'],
					}
			  );
	}
	goTickets() {
		this._router.navigateByUrl('dash/ticketsAlerts/home');
	}

	getFilters() {
		this.alarmFilters = {};
		const hosts = this.getSelectValues('Host', 'Hostname');
		const components = this.getSelectValues('Componente', 'ServiceName');
		const status = this.getSelectValues('Estatus', 'Status');
		const notificacion = this.getSelectValues('Notificación', 'Notification');
		this.alarmFilters.hosts = {
			name: 'Hostname',
			values: hosts,
			defaultValue: this.defaultValue,
		};
		this.alarmFilters.components = {
			name: 'ServiceName',
			values: components,
			defaultValue: this.defaultValue,
		};
		this.alarmFilters.status = {
			name: 'Status',
			values: status,
			defaultValue: this.defaultValue,
		};
		this.alarmFilters.notificacion = {
			name: 'Notification',
			values: notificacion,
			defaultValue: this.defaultValue,
		};
		console.log(this.alarmFilters);
	}

	getSelectValues(header: any, key: any): selectorValue[] {
		const itemSet: any[] = [...new Set(this.serviceAlarms.map((item: any) => item[key]))];
		const itemSelect: selectorValue[] = [{value: 'All', viewValue: `Todos`}];
		for (let item of itemSet) {
			if (item != null && item != 'NULL' && item != 'Null') {
				itemSelect.push({value: item, viewValue: item});
			}
		}
		return itemSelect;
	}

	setFilterPredicate() {
		this.dataAlarms.filterPredicate = function (record, filter) {
			var map = new Map(JSON.parse(filter));
			let isMatch = false;
			for (let [key, value] of map) {
				isMatch =
					value == 'All' || record[key as keyof Alarm] == value || key == 'SearchBar';
				if (!isMatch) return false;
			}
			return isMatch;
		};
	}

	filterSelects(event: any, filter: any = undefined) {
		this.filterApplied = true;

		this.filterDictionary.set(filter.name, event.value);
		let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));

		console.log('filter:', jsonString);

		this.dataAlarms.filter = jsonString;

		filter === '' || filter.length === 1
			? ''
			: this._snackBar.open(
					`Existen ${this.dataAlarms.filteredData.length} registros.`,
					'',
					{
						duration: 3500,
						verticalPosition: 'top',
						/* horizontalPosition: 'center', */
						panelClass: ['background-snack-info'],
					}
			  );
	}

	clearFilters() {
		this.filterApplied = false;

		this.dataAlarms.filter = '';
		for (let key of Object.keys(this.selectors)) {
			this.selectors[key as keyof IHeaders] = 'All';
		}
		console.log(this.selectors);
	}
}
