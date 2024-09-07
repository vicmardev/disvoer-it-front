import {
	AfterViewInit,
	Component,
	ElementRef,
	HostListener,
	OnInit,
	ViewChild,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
exporting(Highcharts);
import highcharts3D from 'highcharts/highcharts-3d';
highcharts3D(Highcharts);
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import {GraphicService} from 'src/app/services/graphic/graphic.service';
import {TicketsService} from 'src/app/services/tickets/tickets.service';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {
	ApexAxisChartSeries,
	ApexChart,
	ChartComponent,
	ApexDataLabels,
	ApexPlotOptions,
	ApexResponsive,
	ApexXAxis,
	ApexLegend,
	ApexFill,
} from 'ng-apexcharts';
import {MatTabChangeEvent} from '@angular/material/tabs';
export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	dataLabels: ApexDataLabels;
	plotOptions: ApexPlotOptions;
	responsive: ApexResponsive[];
	xaxis: ApexXAxis;
	legend: ApexLegend;
	fill: ApexFill;
};

@Component({
	selector: 'app-graphics',
	templateUrl: './graphics.component.html',
	styleUrls: ['./graphics.component.scss'],
})
export class GraphicsComponent implements OnInit {
	@ViewChild('chart')
	container!: ElementRef<HTMLDivElement>;
	chart!: Highcharts.Chart;
	/* apex  chart */

	@ViewChild('chartBrandsBar') chartBar!: ChartComponent | any;
	@ViewChild('ticketHeatMap') ticketsHeatMap!: ChartComponent | any;
	public chartOptions!: Partial<ChartOptions> | any;
	public ticketHeatMapOptions!: Partial<ChartOptions> | any;

	arrayGraphicPie: any = [];
	titlePie: string = '';
	testOptions: any;
	listAllEquipment: any = [];
	countListEquip: any = [];
	listAllContract: any = [];
	pieStatus: any = [];
	brandPieData: any = [];
	userGraphic: any = [];
	panelOpenState = true;
	supportOperator: any = [];
	graphicName: any = [];

	/* graphics  var */
	tittlePie: string = 'Estatus  de  Tickets  actualmente';
	tittleArea: string = 'Total de equipos por dispositivo';
	/* makeGraphic div */
	divPie: string = 'chartPie';
	divArea: string = 'chartArea';

	constructor(
		private _graphicService: GraphicService,
		private _ticketsService: TicketsService,
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer
	) {
		iconRegistry.addSvgIcon(
			'arrow_left',
			sanitizer.bypassSecurityTrustResourceUrl('assets/icons/Flecha2.svg')
		);
		iconRegistry.addSvgIcon(
			'arrow_right',
			sanitizer.bypassSecurityTrustResourceUrl('assets/icons/Flecha1.svg')
		);
	}

	Highcharts: typeof Highcharts = Highcharts;
	hc3dOptions = {
		enabled: true,
		alpha: 15,
		beta: 20,
		depth: 200,
		viewDistance: 10,
	};

	ngOnInit(): void {
		this.refreshInfo();
	}

	tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
		console.log('tabChangeEvent => ', tabChangeEvent);
		console.log('index => ', tabChangeEvent.index);
		tabChangeEvent.index == 0 ? this.refreshInfo : this.refreshSecondPage();
	};

	refreshSecondPage() {
		this.makeGraphicMix();
		this.listUserGraphic();
		this.listUsersPerContract();
	}

	refreshInfo() {
		this.makeGraphicMix();
		this.allTickets();
		this.listEquipment();
		this.listEquipmentBar();
		this.listContract();
		this.contractStatus();
		this.listBrandGraphic();
		this.listUserGraphic();
		this.listTicketsUse();
		this.listUsersPerContract();
		this.listTicketsPerDay();
	}
	allTickets() {
		this._graphicService.getCountTicket().subscribe(res => {
			this.arrayGraphicPie = res;
			this.makeGraphicPie(this.divPie, this.arrayGraphicPie, this.tittlePie);
		});
	}

	listEquipment() {
		this._graphicService.getListEquipment().subscribe(res => {
			this.listAllEquipment = res;
			this.makeGraphicPie(this.divArea, this.listAllEquipment, this.tittleArea);
		});
	}

	listEquipmentBar() {
		this._graphicService.getListEquipment().subscribe(res => {
			this.listAllEquipment = res;
			this.makeGraphicBar(
				'equipmentByInventoryBar',
				this.listAllEquipment,
				this.tittleArea,
				'Número de equipos'
			);
		});
	}

	listContract() {
		let title = 'Total de equipos por contrato';
		this._graphicService.getCountContract().subscribe(res => {
			this.listAllContract = res;
			this.makeGraphicColumn(
				'barras',
				this.listAllContract,
				title,
				'Número de contratos'
			);
		});
	}

	listUsersPerContract() {
		let title = 'Total de usuarios por contrato';
		let divGraphic = 'usersPerContract';
		this._graphicService.getCountUsersPerContract().subscribe(res => {
			let usersPerContract = res;
			this.makeGraphicColumn(divGraphic, usersPerContract, title, 'Número de usuarios');
		});
	}

	listBrandGraphic() {
		let field = 'Brand';
		let title = 'Total de equipos por marca';
		this._graphicService.getAllField(field).subscribe(res => {
			this.brandPieData = res;
			this.makeGraphicColumn(
				'brandGraphic',
				this.brandPieData,
				title,
				'Número de equipos'
			);
		});
	}

	contractStatus() {
		let status = 'Status';
		let divGraphic = 'pieStatusContract';
		let titlePieContr = 'Estado actual de los equipos';
		this._graphicService.getAllField(status).subscribe(res => {
			this.pieStatus = res;
			this.makeGraphicColumn(
				divGraphic,
				this.pieStatus,
				titlePieContr,
				'Número de equipos'
			);
		});
	}

	listUserGraphic() {
		let field = 'role';
		let divGraphic = 'divUser';
		let titleUserGrap = 'Total de  usuarios';
		this._graphicService.getAllFieldUser(field).subscribe(res => {
			this.userGraphic = res;
			//
			this.makeGraphicLine(
				divGraphic,
				this.userGraphic,
				titleUserGrap,
				'Número de usuarios'
			);
		});
	}

	listTicketsUse() {
		let field = 'assignedSupportOperator';
		let divGraphic = 'divUserGraphic';
		let titleUSerTiccketGrap = 'Tickets por operador';
		this._graphicService.getAllFieldTicket(field).subscribe(res => {
			this.supportOperator = res;
			this.makeGraphicAreaLine(
				divGraphic,
				this.supportOperator,
				titleUSerTiccketGrap,
				'Número de tickets'
			);
		});
	}

	listTicketsPerDay() {
		let field = 'assignedSupportOperator';
		let divGraphic = 'divTicketsPerDay';
		let titleUserTicketGraph = 'Tickets por Fecha';
		this._graphicService.getTicketsPerDay().subscribe(res => {
			let tickets = res;
			this.ticketHeatMapOptions = {
				series: tickets,
				chart: {
					height: 320,
					type: 'heatmap',
					toolbar: {
						show: true,
						tools: {
							download: true,
							selection: true,
							zoom: false,
							zoomin: false,
							zoomout: false,
							pan: false,
							reset: false,
						},
					},
					zoom: {enabled: false},
				},
				plotOptions: {
					heatmap: {
						shadeIntensity: 0.5,
						colorScale: {
							ranges: [
								{
									from: 0,
									to: 0,
									name: 'ninguno',
									color: '#00A100',
								},
								{
									from: 1,
									to: 3,
									name: 'bajo',
									color: '#fdc70c',
								},
								{
									from: 4,
									to: 8,
									name: 'intermedio',
									color: '#f3903f',
								},
								{
									from: 9,
									to: 15,
									name: 'alto',
									color: '#ed683c',
								},
								{
									from: 16,
									to: 100,
									name: 'extremo',
									color: '#e93e3a',
								},
								// {
								//   from: 16,
								//   to: 20,
								//   color: "#e93e3a"
								// }
							],
						},
					},
				},
				dataLabels: {
					enabled: false,
				},
				title: {
					text: titleUserTicketGraph,
					align: 'center',
					offsetX: 70,
					offsety: 100,
					style: {
						color: '#808080',
						fontWeight: 'bold',
						fontSize: '20px',
					},
				},
				// responsive: [
				//   {
				//     breakpoint: 480,
				//     options: {
				//       legend: {
				//         position: "bottom",
				//         offsetX: -10,
				//         offsetY: 0
				//       }
				//     }
				//   }
				// ],
			};
		});
	}

	makeGraphicMix() {
		this._graphicService.getEquipmnetCount().subscribe(res => {
			this.graphicName = res;
			this.chartOptions = {
				series: res,
				chart: {
					type: 'bar',
					height: 340,
					with: 100,
					stacked: true,
					stackType: '100%',
				},
				responsive: [
					{
						breakpoint: 480,
						options: {
							legend: {
								position: 'bottom',
								offsetX: -10,
								offsetY: 0,
							},
						},
					},
				],
				xaxis: {
					categories: this.graphicName[4].categorias,
				},
				fill: {
					opacity: 1,
				},
				legend: {
					position: 'right',
					offsetX: 0,
					offsetY: 30,
				},
			};
		});
	}

	/* PayChart   */
	makeGraphicPie(container: string, datos: any, title: string) {
		let chart = Highcharts.chart(container, {
			title: {
				text: `${title}`,
				align: 'left',
				x: 10,
				style: {
					color: '#808080',
					fontWeight: 'bold',
					fontSize: '20px',
				},
			},
			chart: {
				backgroundColor: {
					stops: [
						[0, 'rgb(255, 255, 255)'],
						[1, 'rgb(240, 240, 255)'],
					],
				},
				options3d: {
					enabled: true,
					alpha: 45,
					beta: 0,
				},
			},
			tooltip: {
				pointFormat: '{point._id}: <b>{point.percentage:.1f}%</b> Total:<b>{point.y}</b>',
				style: {
					fontSize: '16px',
				},
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					depth: 35,
					dataLabels: {
						enabled: true,
						format:
							'<b>{point._id}</b><br>{point.percentage:.1f} % <br>Total:<b>{point.y}</b>',
						distance: -50,
						style: {
							fontSize: '14px',
						},
						filter: {
							property: 'percentage',
							operator: '>',
							value: 6,
						},
					},
				},
			},
			series: [
				{
					data: datos,
					type: 'pie',
				},
			],
			credits: {
				enabled: false,
			},
		});
	}
	/* AreaChart*/
	makeGraphicArea(container: string, datos: any, title: string) {
		let listNameEquip: any = [];
		datos.forEach((element: any) => {
			listNameEquip.push(element._id);
		});

		let charArea = Highcharts.chart(container, {
			chart: {
				backgroundColor: {
					stops: [
						[0, 'rgb(255, 255, 255)'],
						[1, 'rgb(240, 240, 255)'],
					],
				},
				options3d: this.hc3dOptions,
			},
			title: {
				text: `${title}`,
				align: 'center',
				x: 70,
				style: {
					color: '#808080',
					fontWeight: 'bold',
					fontSize: '20px',
				},
			},
			legend: {
				layout: 'vertical',
				align: 'center',
				verticalAlign: 'top',
				x: 90,
				y: 40,
				floating: true,
				borderWidth: 1,
			},
			xAxis: {
				categories: listNameEquip,
				plotBands: [
					{
						from: 4.5,
						to: 6.5,
						color: '#0a8db8',
					},
				],
				labels: {
					autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
					style: {
						color: 'black',
						fontSize: '16px',
					},
				},
			},
			yAxis: {
				title: {
					text: 'Cantidad de Equipos',
					margin: 60,
					style: {
						color: 'black',
						fontSize: '16px',
					},
				},
			},
			credits: {
				enabled: false,
			},
			plotOptions: {
				areaspline: {
					fillOpacity: 0.8,
				},
			},
			series: [
				{
					name: 'Equipos',
					type: 'area',
					color: '#808080',
					data: datos,
				},
			],
		});
	}
	/* BarChart Vertical */
	makeGraphicColumn(container: string, datos: any, title: string, label: string) {
		let listNameContracts: any = [];
		datos.forEach((element: any) => {
			listNameContracts.push(element._id);
		});
		Highcharts.setOptions({
			colors: [
				'#1976d2',
				'#26dad2',
				'#ED561B',
				'#dadada',
				'#F2E857 ',
				'#24CBE5',
				'#FF9655',
				'#BA8AF9 ',
				'#745af2',
			],
		});
		let chart = Highcharts.chart(container, {
			chart: {
				backgroundColor: {
					stops: [
						[0, 'rgb(255, 255, 255)'],
						[1, 'rgb(240, 240, 255)'],
					],
				},
				options3d: this.hc3dOptions,
			},
			title: {
				text: title,
				align: 'center',
				x: 5,
				style: {
					color: '#808080',
					fontWeight: 'bold',
					fontSize: '20px',
				},
			},
			accessibility: {
				announceNewData: {
					enabled: true,
				},
			},
			xAxis: {
				categories: listNameContracts,
				labels: {
					autoRotationLimit: 200,
					style: {
						color: 'black',
						fontSize: '12px',
					},
				},
			},
			yAxis: {
				title: {
					text: label,
					margin: 60,
					style: {
						color: 'black',
						fontSize: '16px',
					},
				},
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				series: {
					borderWidth: 0,
					dataLabels: {
						enabled: true,
						format: '<span style="color:black;font-size:15px;">{point.y}</span>',
					},
				},
			},

			tooltip: {
				headerFormat: '<span style="font-size:11px">{series._id}</span><br>',
				pointFormat:
					'<span style="color:{point.color}">{point._id}</span>: <b>{point.y}<br/>',
			},

			series: [
				{
					name: 'Contratos',
					colorByPoint: true,
					type: 'column',
					data: datos,
				},
			],
			credits: {
				enabled: false,
			},
		});
	}
	/* BarChart Hprizontal */
	makeGraphicBar(container: string, datos: any, title: string, label: string) {
		let listNameContracts: any = [];
		datos.forEach((element: any) => {
			listNameContracts.push(element._id);
		});
		Highcharts.setOptions({
			colors: [
				'#058DC7',
				'#50B432',
				'#ED561B',
				'#F2E857 ',
				'#24CBE5',
				'#64E572',
				'#FF9655',
				'#BA8AF9 ',
				'#6AF9C4',
			],
		});
		let chart = Highcharts.chart(container, {
			chart: {
				backgroundColor: {
					stops: [
						[0, 'rgb(255, 255, 255)'],
						[1, 'rgb(240, 240, 255)'],
					],
				},
				options3d: this.hc3dOptions,
			},
			title: {
				text: title,
				align: 'left',
				x: 10,
				style: {
					color: '#808080',
					fontWeight: 'bold',
					fontSize: '20px',
				},
			},
			accessibility: {
				announceNewData: {
					enabled: true,
				},
			},
			xAxis: {
				categories: listNameContracts,
				labels: {
					autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
					style: {
						color: 'black',
						fontSize: '12px',
					},
				},
			},
			yAxis: {
				title: {
					text: label,
					margin: 60,
					style: {
						color: 'black',
						fontSize: '16px',
					},
				},
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				series: {
					borderWidth: 0,
					dataLabels: {
						enabled: true,
						format: '<span style="color:black;font-size:15px;">{point.y}</span>',
					},
				},
			},

			tooltip: {
				headerFormat: '<span style="font-size:11px">{series._id}</span><br>',
				pointFormat:
					'<span style="color:{point.color}">{point._id}</span>: <b>{point.y}<br/>',
			},

			series: [
				{
					name: 'Contratos',
					colorByPoint: true,
					type: 'bar',
					data: datos,
				},
			],
			credits: {
				enabled: false,
			},
		});
	}
	makeGraphicLine(container: string, datos: any, title: string, label: string) {
		let listNameContracts: any = [];
		datos.forEach((element: any) => {
			listNameContracts.push(element._id);
		});
		Highcharts.setOptions({
			colors: [
				'#058DC7',
				'#50B432',
				'#ED561B',
				'#F2E857 ',
				'#24CBE5',
				'#64E572',
				'#FF9655',
				'#BA8AF9 ',
				'#6AF9C4',
			],
		});
		let chart = Highcharts.chart(container, {
			chart: {
				backgroundColor: {
					stops: [
						[0, 'rgb(255, 255, 255)'],
						[1, 'rgb(240, 240, 255)'],
					],
				},
				options3d: this.hc3dOptions,
			},
			title: {
				text: title,
				align: 'left',
				x: 10,
				style: {
					color: '#808080',
					fontWeight: 'bold',
					fontSize: '20px',
				},
			},
			accessibility: {
				announceNewData: {
					enabled: true,
				},
			},
			xAxis: {
				categories: listNameContracts,
				labels: {
					autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
					style: {
						color: 'black',
						fontSize: '12px',
					},
				},
			},
			yAxis: {
				title: {
					text: label,
					margin: 60,
					style: {
						color: 'black',
						fontSize: '16px',
					},
				},
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				series: {
					borderWidth: 0,
					dataLabels: {
						enabled: true,
						format: '<span style="color:black;font-size:15px;">{point.y}</span>',
					},
				},
			},

			tooltip: {
				headerFormat: '<span style="font-size:11px">{series._id}</span><br>',
				pointFormat:
					'<span style="color:{point.color}">{point._id}</span>: <b>{point.y}<br/>',
			},

			series: [
				{
					name: 'Contratos',
					colorByPoint: true,
					type: 'area',
					data: datos,
				},
			],
			credits: {
				enabled: false,
			},
		});
	}
	makeGraphicAreaLine(container: string, datos: any, title: string, label: string) {
		let listNameContracts: any = [];
		datos.forEach((element: any) => {
			listNameContracts.push(element._id);
		});
		Highcharts.setOptions({
			colors: [
				'#058DC7',
				'#50B432',
				'#ED561B',
				'#F2E857 ',
				'#24CBE5',
				'#64E572',
				'#FF9655',
				'#BA8AF9 ',
				'#6AF9C4',
			],
		});
		let chart = Highcharts.chart(container, {
			chart: {
				backgroundColor: {
					stops: [
						[0, 'rgb(255, 255, 255)'],
						[1, 'rgb(240, 240, 255)'],
					],
				},
				options3d: this.hc3dOptions,
			},
			title: {
				text: title,
				align: 'left',
				x: 10,
				style: {
					color: '#808080',
					fontWeight: 'bold',
					fontSize: '20px',
				},
			},
			accessibility: {
				announceNewData: {
					enabled: true,
				},
			},
			xAxis: {
				categories: listNameContracts,
				labels: {
					autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
					style: {
						color: 'black',
						fontSize: '12px',
					},
				},
			},
			yAxis: {
				title: {
					text: label,
					margin: 60,
					style: {
						color: 'black',
						fontSize: '16px',
					},
				},
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				series: {
					borderWidth: 0,
					dataLabels: {
						enabled: true,
						format: '<span style="color:black;font-size:15px;">{point.y}</span>',
					},
				},
			},

			tooltip: {
				headerFormat: '<span style="font-size:11px">{series._id}</span><br>',
				pointFormat:
					'<span style="color:{point.color}">{point._id}</span>: <b>{point.y}<br/>',
			},

			series: [
				{
					name: 'Contratos',
					colorByPoint: true,
					type: 'column',
					data: datos,
				},
			],
			credits: {
				enabled: false,
			},
		});
	}
}
