import {
	Component,
	ElementRef,
	Input,
	SimpleChanges,
	OnInit,
	ViewChild,
} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAccordion} from '@angular/material/expansion';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {TicketsService} from 'src/app/services/tickets/tickets.service';
import {MatStepper} from '@angular/material/stepper';
import {
	NgApexchartsModule,
	ApexAxisChartSeries,
	ApexChart,
	ApexNonAxisChartSeries,
	ChartComponent,
	ApexDataLabels,
	ApexPlotOptions,
	ApexResponsive,
	ApexXAxis,
	ApexLegend,
	ApexFill,
} from 'ng-apexcharts';
import {MatPaginator} from '@angular/material/paginator';
import {Tickets} from 'src/app/models/Tickets';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {EditAliasTicketComponent} from '../../dialogs/tickets/edit-alias-ticket/edit-alias-ticket.component';

export type ChartOptions = {
	series: ApexNonAxisChartSeries;
	chart: ApexChart;
	dataLabels: ApexDataLabels;
	plotOptions: ApexPlotOptions;
	responsive: ApexResponsive[];
	xaxis: ApexXAxis;
	legend: ApexLegend;
	fill: ApexFill;
};

@Component({
	selector: 'app-inventory-tickets',
	templateUrl: './inventory-tickets.component.html',
	styleUrls: ['./inventory-tickets.component.scss'],
})
export class InventoryTicketsComponent implements OnInit {
	@Input() componentInventory: any;
	//start  the  info  tickets
	idTicketSelect: string = '';
	tableInfo: any[] = [];
	selectedRow: number = -1;
	highLightOn: boolean = false;
	coutPending: any;
	countComplete: any;
	countActive: any;
	countTotal: any;
	countCancel: any;
	countReasing: any;
	rowSelect: any;
	flagDivComponet: boolean = false;
	tiempo: any;
	clock: any;
	displayedColumns: string[] = [
		'ticketID',
		'alias',
		'severity',
		'status',
		'issueType',
		'stepTicket',
		'created',
		/* 'Operator', 
		'userName',
		'title',
		'issueType',
		'description',
		'equipment',
		'equipmentSerial',
		'clientEvidencePath', 
		'closeDate',
		'responseComments',
	  /*   'telephone' */
	];
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	dataSource = new MatTableDataSource<Tickets>();

	titleTicket: string = '';
	dateCreation: any;

	selectedRowIndex: number = -1;

	phaseTicket: number = 0;
	@Input() selectTicket: any;
	@ViewChild('stepper', {read: MatStepper}) stepper!: MatStepper;

	@ViewChild('chart') chart!: Highcharts.Chart;
	container!: ElementRef<HTMLDivElement>;

	@ViewChild('testGraphic') testBar!: ChartComponent | any;
	@ViewChild(MatSort) sort!: MatSort;

	public chartOptions!: Partial<ChartOptions> | any;

	@ViewChild('alarmOk') chartOk!: ChartComponent;
	public chartOptionsOk!: Partial<ChartOptions> | any;
	@ViewChild('ticketWarning') chartwar!: ChartComponent;
	public chartOptionWarning!: Partial<ChartOptions> | any;
	@ViewChild('ticketCanceled') chartcan!: ChartComponent;
	public chartOptionCanceled!: Partial<ChartOptions> | any;
	@ViewChild('ticketCTotal') charttotal!: ChartComponent;
	public chartOptionTotal: Partial<ChartOptions> | any;
	@ViewChild('ticketReasigned') chartReasign!: ChartComponent;
	public chartOptionReasing: Partial<ChartOptions> | any;

	constructor(
		private _ticketServices: TicketsService,
		private dialog: MatDialog,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.getAllTickets();
	}

	ngOnChanges(changes: SimpleChanges): void {
		/* 	setTimeout(() => {
			this.stepper.reset();
			this.phaseTicket = this.selectTicket.stepTicket;
			this.stepper.selectedIndex = this.phaseTicket - 1;
		}); */
		/* setTimeout(() => {
			this.timerTicket()
		}, 1); */
	}

	highlight(row: any) {
		this.selectedRowIndex = row;
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	getAllTickets() {
		this._ticketServices.getAllInventoryTickets().subscribe((res: any) => {
			this.tableInfo = res;
			this.dataSource.data = this.tableInfo;
			this.countAllTickets();
		});
	}

	applyFilter(event: Event) {
		const filtro = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filtro.trim().toLowerCase();
	}

	filterStatus(statusVal: string) {
		if (statusVal === 'Total') {
			this.dataSource.data = this.tableInfo;
		} else {
			const filter = this.tableInfo.filter((m: any) => m.status === statusVal);
			this.dataSource.data = filter;
		}
	}
	countAllTickets() {
		const allPending = this.tableInfo.filter((m: any) => m.status === 'Pending');
		const allComplete = this.tableInfo.filter((c: any) => c.status === 'Complete');
		const allCancel = this.tableInfo.filter((x: any) => x.status === 'Canceled');
		const allReasing = this.tableInfo.filter((x: any) => x.status === 'Reasing');
		this.coutPending = allPending.length;
		this.countComplete = allComplete.length;
		this.countCancel = allCancel.length;
		this.countTotal = this.tableInfo.length;
		this.countReasing = allReasing.length;

		this.makeGraphicWarning();
	}
	makeGraphicWarning() {
		this.chartOptionTotal = {
			colors: ['#efcc00', '#cc4c32', '#2db674', '#6E6E6E'],
			series: [
				((this.coutPending / this.countTotal) * 100).toFixed(2),
				((this.countCancel / this.countTotal) * 100).toFixed(2),
				((this.countComplete / this.countTotal) * 100).toFixed(2),
				/* ((this.countReasing / this.countTotal * 100).toFixed(2)), */
			],
			chart: {
				height: 280,
				type: 'radialBar',
			},
			plotOptions: {
				radialBar: {
					dataLabels: {
						name: {
							fontSize: '22px',
						},
						value: {
							fontSize: '16px',
						},
						total: {
							show: true,
							label: `Totales: ${this.countTotal}`,
							formatter: function () {
								return '';
							},
						},
					},
				},
			},
			title: {
				/* text: `Tickets: ${this.countTotal}`, */
				/* align: 'center', */
				style: {
					fontSize: '15px',
					color: '#0099CC',
				},
			},
			labels: ['Pendientes', 'Cancelados', 'Completos', 'Reasignados'],
			responsive: [
				{
					breakpoint: 350,
					options: {
						chart: {
							width: 100,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		};

		this.chartOptionWarning = {
			colors: ['#efcc00'],
			series: [((this.coutPending / this.countTotal) * 100).toFixed(2)],
			chart: {
				height: 280,
				type: 'radialBar',
			},
			title: {
				/* text: `Tickets: ${this.coutPending}`,
				align: 'center', */
				style: {
					fontSize: '15px',
					color: '#efcc00',
				},
			},
			labels: [`Pendientes: ${this.coutPending}`],
			responsive: [
				{
					breakpoint: 350,
					options: {
						chart: {
							width: 100,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		};

		this.chartOptionCanceled = {
			colors: ['#cc4c32'],
			series: [((this.countCancel / this.countTotal) * 100).toFixed(2)],
			chart: {
				height: 280,
				type: 'radialBar',
			},
			title: {
				/* text: `Tickets: ${this.countCancel}`,
				align: 'center', */
				style: {
					fontSize: '15px',
					color: '#cc4c32',
				},
			},
			labels: [`Cancelados: ${this.countCancel}`],
			responsive: [
				{
					breakpoint: 350,
					options: {
						chart: {
							width: 100,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		};

		this.chartOptionsOk = {
			colors: ['#2db674'],
			series: [((this.countComplete / this.countTotal) * 100).toFixed(2)],
			chart: {
				height: 280,
				type: 'radialBar',
			},
			title: {
				/* text: `Tickets: ${this.countComplete}`,
				align: 'center', */
				style: {
					fontSize: '15px',
					color: '#2db674',
				},
			},
			labels: [`Completos: ${this.countComplete}`],
			responsive: [
				{
					breakpoint: 350,
					options: {
						chart: {
							width: 100,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		};

		this.chartOptionReasing = {
			colors: ['#6E6E6E'],
			series: [((this.countReasing / this.countTotal) * 100).toFixed(2)],
			chart: {
				height: 280,
				type: 'radialBar',
			},
			title: {
				/* text: `Tickets:55`,
				align: 'center', */
				style: {
					fontSize: '15px',
					color: '#6E6E6E',
				},
			},
			labels: [`Reassigned`],
			responsive: [
				{
					breakpoint: 350,
					options: {
						chart: {
							width: 100,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		};
	}

	//other
	getUniqueId(row: any) {
		this.flagDivComponet = false;

		this.rowSelect = '';
		this.idTicketSelect = row.ticketID;
		this.rowSelect = row;
		this.flagDivComponet = true;
	}

	timerTicket() {
		this.clock = new Date('2016-06-01 5:00:00 PM'); // Obtener la fecha almacenar en clock
		this.clock.toLocaleTimeString(); // Obtener la fecha y almacenar en clock
		//var intervalo = window.setInterval(mostrar_hora, 1); // Frecuencia de actualización
		var i = 0; // Esta variable me ayudará a definir los estados de intervalo

		var now = new Date();
		// Inserta la hora almacenada en clock en el span con id hora
		this.tiempo.horas = document.getElementById('hora');
		this.tiempo.horas.innerHTML = this.clock.getHours() - now.getHours();

		// Inserta los minutos almacenados en clock en el span con id minuto
		this.tiempo.minuto = document.getElementById('minuto');
		this.tiempo.minuto.innerHTML = this.clock.getMinutes() + 60 - now.getMinutes();

		// Inserta los segundos almacenados en clock en el span con id segundo
		this.tiempo.segundos = document.getElementById('segundo');
		this.tiempo.segundos.innerHTML = this.clock.getSeconds() + 60 - now.getSeconds();
	}

	doubleClick(element: any, cellType: String) {
		switch (cellType) {
			case 'Alias':
				this.openDialogEdit(element, 0);
				break;
			default:
				break;
		}
	}

	openDialogEdit(rowInfo: any, index: number) {
		const dialogRef = this.dialog.open(EditAliasTicketComponent, {
			width: 'auto',
			height: 'auto',
			data: {
				info: rowInfo,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getAllTickets();
		});
	}
}
