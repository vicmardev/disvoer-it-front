import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {InventoryService} from 'src/app/services/inventory/inventory.service';
import {MatDialog} from '@angular/material/dialog';
import {InfoRowInventoryComponent} from '../../../pages/dialogs/info-row-inventory/info-row-inventory.component';
import {CreateTicketInventoryComponent} from '../../../pages/dialogs/create-ticket-inventory/create-ticket-inventory.component';
import {User} from 'src/app/models/User';
import {AccountService} from 'src/app/services/account/account.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ShowExcelErrorsComponent} from '../../../pages/dialogs/inventory/show-excel-errors/show-excel-errors.component';
import {IDataCenter} from 'src/app/models/IDataCenter';
import {IContract} from 'src/app/models/IContract';
import {ListEquipmentsComponent} from './dialogs/list-equipments/list-equipments.component';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import {saveAs} from 'file-saver';
import {NONE_TYPE} from '@angular/compiler';
import {PDFDocument, rgb, StandardFonts, cmyk} from 'pdf-lib';
import {AddBudgetComponent} from './dialogs/add-budget/add-budget.component';
import {EditDatacenterComponent} from './dialogs/edit-datacenter/edit-datacenter.component';
import {EditAliasComponent} from './dialogs/edit-alias/edit-alias.component';
import {ImportExcelComponent} from './dialogs/import-excel/import-excel.component';
import {ImportExcelErrorsComponent} from './dialogs/import-excel-errors/import-excel-errors.component';
import {ContractsService} from 'src/app/services/contracts/contracts.service';
import {IQueryResult} from 'src/app/models/IQueryResult';
import {groupBy, property} from 'lodash';
interface QueryResult extends IQueryResult {
	data: Contract[];
}

interface DataCenter extends IDataCenter {
	EquipmentsCount: number;
	Address: String;
}

interface Contract extends IContract {
	ClientName: String;
	EquipmentsCount: number;
	DataCenters: DataCenter[];
	DataCentersCount: number;
	EquipmentsTotal: number;
	DaysRemaining: number;
	ContractLength: number;
	SpentDays: number;
}

interface TableData {
	Contract: Contract;
	DataCenterTableModel?: MatTableDataSource<DataCenter>;
}

type ListEquipmentsData = {
	contract: IContract | null;
	dataCenter: IDataCenter | null;
};

@Component({
	selector: 'app-inventory',
	templateUrl: './validcontracts.component.html',
	styleUrls: ['./validcontracts.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({height: '0px', minHeight: '0'})),
			state('expanded', style({height: '*', minHeight: '*'})),
			transition(
				'expanded <=> collapsed',
				animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
			),
		]),
		trigger('alarmReport', [
			state('collapsed', style({height: '0px', minHeight: '0'})),
			state('expanded', style({height: '*', minHeight: '*'})),
			transition(
				'expanded <=> collapsed',
				animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
			),
		]),
	],
})
export class ValidContractsComponent implements OnInit {
	tableData: TableData[] = [];
	flagRow: boolean = false;
	startDate: any;
	endDate: any;
	selectedRow: number = -1;
	highLightOn: boolean = false;
	flagFilter: string = '';
	progressWidth: number = 0;
	expandedElement: any = null;
	loadedTableData: boolean = false;

	public selectedContract: Contract | null;
	public selectedDataCenter: DataCenter | null;

	url: any = '';
	statusList: any;
	kitWelcome = new JSZip();
	loading: boolean = false;
	contracInfo: any = [];
	displayedColumns: string[] = [
		//'Model',
		'Contract',
		'Alias',
		'Client',
		'DataCenters',
		'EquipmentsTotal',
		'StartContract',
		'EndContract',
		'Status',
		'DaysRemaining',
		'Days',
		'Actions',
	];

	innerDisplayedColumns = [
		'DataCenter',
		'Equipment',
		'Country',
		'City',
		'Address',
		'Actions',
	];

	allStatus = [
		{value: 'all', name: 'Todo'},
		{value: 'Suspended', name: 'Suspendido'},
		{value: 'Active', name: 'Activo'},
		{value: 'To Be Suspend', name: 'Por suspender'},
	];

	public dataSource = new MatTableDataSource<TableData>();
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	user!: User;
	panelOpenState: boolean = false;
	oldExpandedElement: any;
	clickCount = 0;

	// Filter controls
	tableTextFiltered: boolean = false;
	textFilterTable = '';

	tableDateRangeFiltered: boolean = false;
	dateRangeFilterStart = '';
	dateRangeFilterEnd = '';

	tableStatusFiltered: boolean = false;
	statusFilter = 0;

	constructor(
		private _invetaryService: InventoryService,
		private contractService: ContractsService,
		public dialog: MatDialog,
		private accountService: AccountService,
		private snackBar: MatSnackBar,
		private _contractService: ContractsService
	) {
		this.user = this.accountService.userValue;
		this.loadTableInfo();
		this.selectedContract = null;
		this.selectedDataCenter = null;
	}

	getProgressClass(daysRemaining: number) {
		if (daysRemaining < 7) return 'danger-progress';
		else if (daysRemaining < 30) return 'warn-progress';
		else return 'green-progress';
	}
	progressBarToolTipText(daysRemaining: any, contractLength: any) {
		if (daysRemaining < 1)
			return `Tu contrato esta suspendido, realizar pago para  activar`;
		else if (daysRemaining < 30)
			return `${daysRemaining} días restantes de tu contrato. Tu contrato está por acabar`;
		return `${daysRemaining} días restantes de tu contrato`;
	}
	getColor(daysRemaining: any) {
		if (daysRemaining > 30) return 'primary';
		else if (daysRemaining > 7) return 'accent';
		else return 'warn';
	}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		setTimeout(() => (this.dataSource.paginator = this.paginator));
	}

	loadTableInfo() {
		this.contractService.contractsDatacenters().subscribe(results => {
			const queryResult = results as QueryResult;
			this.loadedTableData = true;

			if (queryResult.status) {
				const contracts = queryResult.data;

				// Clean previous table data
				this.tableData = [];
				this.setInfo(contracts);

				contracts.forEach((contract: Contract) => {
					if (contract.DataCenters.length > 0) {
						this.tableData.push({
							Contract: contract,
							DataCenterTableModel: new MatTableDataSource<DataCenter>(
								contract.DataCenters
							),
						});
					} else {
						this.tableData.push({Contract: contract});
					}
				});
				this.dataSource.data = this.tableData;
			} else {
				this.QueryErrorSnack(queryResult.msg);
			}
		});
	}

	private setAddress(datacenter: DataCenter) {
		datacenter.Address =
			`${datacenter.Street}` +
			`${datacenter.ExternalNumber ? `, No. ${datacenter.ExternalNumber}` : ''}` +
			`${datacenter.InternalNumber ? `, Int. ${datacenter.InternalNumber}` : ''}` +
			`${datacenter.Neighborhood ? `, ${datacenter.Neighborhood}` : ''}` +
			`${datacenter.Delegation ? `, ${datacenter.Delegation}` : ''}` +
			`${datacenter.PostalCode ? `, C.P. ${datacenter.PostalCode}` : ''}`;
	}


	private setInfo(contracts: Contract[]) {
		for (const contract of contracts) {
			const dayInfo = this.remainingDays(contract.StartContract, contract.EndContract);

			contract.EquipmentsTotal = 0;
			for (const datacenter of contract.DataCenters) {
				contract.EquipmentsTotal += datacenter.EquipmentsCount;
				this.setAddress(datacenter);
			}

			[contract.DaysRemaining, contract.ContractLength, contract.SpentDays] = [
				dayInfo.daysRemaining,
				dayInfo.contractLength,
				dayInfo.timeSpent,
			];

			if (contract.DaysRemaining < 15) {
				contract.Status = 'To Be Suspend';
			}

			if (contract.DaysRemaining < 1) {
				contract.Status = 'Suspended';
			}
			/*
			if (this.user.role == 'User') {
				if (contract.DaysRemaining > 0 && contract.DaysRemaining < 30)
					this.openDialogAlert(
						`Tu contrato ${contract.Contract} expira en ${contract.DaysRemaining}`
					);
				if (contract.DaysRemaining <= 0)
					this.openDialogAlert(`Tu contrato ${contract.Contract} ha expirado`);
			} */
		}
	}

	dialogEditAlias(contract: Contract) {
		const dialogRef = this.dialog.open(EditAliasComponent, {
			width: 'auto',
			height: 'auto',
			data: contract,
		});

		dialogRef.afterClosed().subscribe(result => {
			//this.loadTableInfo();
		});
	}

	openDialogAddBudget(contractName: any, index: number) {
		this.flagRow = true;
		// console.log(contractName);

		const dialogRef = this.dialog.open(AddBudgetComponent, {
			width: '20%',
			height: 'auto',
			data: {
				info: contractName,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.loadTableInfo();
		});
	}

	// Table filters
	private cleanTextFilter() {
		this.textFilterTable = '';
		if (this.tableTextFiltered) {
			this.tableTextFiltered = false;
			this.resetTableData();
		}
	}

	private cleanDateRangeFilter() {
		this.dateRangeFilterStart = '';
		this.dateRangeFilterEnd = '';
		if (this.tableDateRangeFiltered) {
			this.tableDateRangeFiltered = false;
			this.resetTableData();
		}
	}

	private cleanStatusFilter() {
		this.statusFilter = 0;
		if (this.tableStatusFiltered) {
			this.tableStatusFiltered = false;
			this.resetTableData();
		}
	}

	filterTable(event: Event) {
		this.tableTextFiltered = true;
		this.cleanDateRangeFilter();
		this.cleanStatusFilter();
		const searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
		if (searchTerm.length >= 1) {
			const searchResult = this.tableData.filter((row: TableData) => {
				return (
					row.Contract.Contract.toLowerCase().includes(searchTerm) ||
					row.Contract.Alias?.toLowerCase().includes(searchTerm) ||
					row.Contract.ClientName.toLowerCase().includes(searchTerm)
				);
			});

			this.dataSource.data = searchResult;
			this.showSearchResults(searchResult.length);
		} else {
			this.resetTableData();
		}
	}

	filterDateStart(event: any) {
		this.tableDateRangeFiltered = true;
		this.cleanTextFilter();
		this.cleanStatusFilter();
		this.startDate = event.value;
		this.endDate = null;
	}

	filterDateEnd(event: any) {
		this.tableDateRangeFiltered = true;
		this.cleanTextFilter();
		this.cleanStatusFilter();

		this.endDate = event.value;
		let start = this.startDate.toISOString().substr(0, 10);
		if (this.endDate) {
			let end = this.endDate.toISOString().substr(0, 10);
			const searchResult = this.tableData.filter((row: TableData) => {
				if (start <= row.Contract.StartContract && end >= row.Contract.EndContract)
					return true;
				if (start >= row.Contract.StartContract && end <= row.Contract.EndContract)
					return true;
				if (
					start <= row.Contract.StartContract &&
					end >= row.Contract.StartContract &&
					end <= row.Contract.EndContract
				)
					return true;
				if (
					start >= row.Contract.StartContract &&
					start <= row.Contract.EndContract &&
					end >= row.Contract.EndContract
				)
					return true;
				return false;
			});
			this.dataSource.data = searchResult;
			this.showSearchResults(searchResult.length);
		}
	}

	filterStatus(selectedValue: any) {
		this.tableStatusFiltered = true;
		this.cleanTextFilter();
		this.cleanDateRangeFilter();
		const filter = this.tableData.filter((row: TableData) => {
			return row.Contract.Status === selectedValue.value;
		});
		this.dataSource.data = filter;
		if (selectedValue.value === 'all') {
			this.resetTableData();
		}
		this.showSearchResults(this.dataSource.data.length);
	}

	// Shows snackbar with number of matches for a search filter
	private showSearchResults(numResults: number) {
		let msg =
			numResults >= 1 ? `Existen ${numResults} registros` : `No existen registros`;

		this.snackBar.open(msg, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: [numResults >= 1 ? 'background-snack-info' : 'background-snack-red'],
		});
	}

	private resetTableData() {
		this.dataSource.data = this.tableData;
	}

	importExcel() {
		const dialogRef = this.dialog.open(ImportExcelComponent, {
			width: '430px',
			height: '370px',
			disableClose: true,
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result.status) {
				this.loadTableInfo();
			} else {
				if (result.data !== undefined) {
					this.importExcelErrors(result.data);
				} else {
					if (result.msg) {
						this.closeSnack(result.msg);
					}
				}
			}
		});
	}

	importExcelErrors(data: any) {
		const dialog = this.dialog.open(ImportExcelErrorsComponent, {
			height: 'auto',
			width: '75vw',
			data: data,
			maxHeight: '90vh',
			disableClose: true,
		});
	}

	openDialogInfo(rowInfo: any) {
		const dialogRef = this.dialog.open(InfoRowInventoryComponent, {
			width: 'auto',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				info: rowInfo,
			},
		});
	}

	openDialogTicket(rowInfo: any) {
		const dialogRef = this.dialog.open(CreateTicketInventoryComponent, {
			width: 'auto',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				info: rowInfo,
			},
		});
	}

	openDialogExcelErrors(error: any) {
		const dialogErrorList = this.dialog.open(ShowExcelErrorsComponent, {
			width: '80%',
			height: '80%',
			data: {error},
		});
	}

	remainingDays(startDate: any, endDate: any) {
		const start = Date.parse(startDate);
		const end = Date.parse(endDate);
		const now = Date.now();
		//amount of secinds in a day
		const dayLength = 86400;
		//amount of seconds in hour
		const hourLength = 3600;
		let contractLength = end / 1000 - start / 1000;
		let timeSpent = now / 1000 - start / 1000;
		let daysRemaining = Math.floor((contractLength - timeSpent) / dayLength);
		contractLength = Math.floor(contractLength / dayLength);
		timeSpent = Math.floor(timeSpent / dayLength);

		return {daysRemaining, contractLength, timeSpent};
	}
	goToUrl(ip: string) {
		window.open(`http://${ip}/`, '_blank');
	}

	editAlias(contract: Contract) {
		this.dialogEditAlias(contract);
	}
	dowloadPDf(contrato: any) {
		this.url = `http://169.59.166.94/uploads/Contratos/${contrato.Contract}.pdf`;
		window.open(this.url, '_blank');
	}

	listEquipment(datacenter: DataCenter) {
		this.selectDataCenter(datacenter);
		this.dialogListEquipments();
	}

	selectContract(row: TableData, expandDataCenters: boolean = true) {
		this.selectedContract = row.Contract;
		if (expandDataCenters) {
			this.expandDataCenters(row);
		}
	}

	selectDataCenter(datacenter: DataCenter) {
		this.selectedDataCenter = datacenter;
	}

	deselectDataCenter() {
		this.selectedDataCenter = null;
	}

	contractMenuOpened(row: TableData) {
		const clickedContract = row.Contract;
		if (clickedContract.IdContract !== this.selectedContract?.IdContract) {
			this.selectedContract = clickedContract;
		}
	}

	contractMenuClosed() {
		if (!this.expandedElement) {
			// The Datacenters tables is closed, then deselect the contracts row
			this.selectedContract = null;
		}
	}

	private expandDataCenters(row: TableData) {
		if (this.expandedElement === row) {
			// Datacenter table is open
			this.selectedContract = null;
			this.expandedElement = null;
		} else {
			// Datacenter table is closed
			this.selectedContract = row.Contract;
			this.expandedElement = row;
		}
	}

	dialogEditDataCenter(dataCenter: DataCenter) {
		const dialogRef = this.dialog.open(EditDatacenterComponent, {
			width: '640px',
			height: '640px',
			maxHeight: '90v ',
			data: {
				dataCenter: this.selectedDataCenter,
			},
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			this.deselectDataCenter();
		});
	}

	dialogListEquipments() {
		const data: ListEquipmentsData = {
			contract: this.selectedContract,
			dataCenter: this.selectedDataCenter,
		};

		const dialogRef = this.dialog.open(ListEquipmentsComponent, {
			width: '100vw',
			height: '95vh',
			minWidth: '50vw',
			data: data,
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			this.deselectDataCenter();
		});
	}

	//Genera el zip
	async generateZip(element: any) {
		this.kitWelcome = new JSZip();
		const contractT = element.Contract.Contract;
		this.contracInfo = await this._invetaryService.getAllInfoContract(contractT).toPromise();
		let coverage;
		let scalingMatrix;
		if(this.contracInfo.IdOwnerCompany ==1 ){
			coverage = 'assets/docs/contrato/Cobertura_Alpha.pdf';
			scalingMatrix = 'assets/docs/contrato/Matriz_alpha.pdf';
		}
		else{
			coverage = 'assets/docs/contrato/Cobertura_Virwo.pdf';
			scalingMatrix = 'assets/docs/contrato/Matriz_escalacion.pdf';
		}

		let contractName: any = this.contracInfo.Contract;
		let coverageFile = await this.fileConvert(coverage, 'Cobertura');
		let matrixFile = await this.fileConvert(scalingMatrix, 'Matriz de escalacion');
		let contractFill: any = await this.fillFile(this.contracInfo);
		let files = [coverageFile, matrixFile, contractFill];
		if(this.contracInfo.IdOwnerCompany==1){
			for(let file of files){
				let link = document.createElement('a');
				link.href= window.URL.createObjectURL(file);
				let data = await JSZipUtils.getBinaryContent(link.href);
				let name = ''
				if(file.size > 1588818 && file.size < 1598918){
					name = 'Matriz de escalacion'
				}
				else if(file.size  > 1132560 && file.size < 1200000) {
					name='Cobertura Alpha'
				}
				else {
					name =contractName
				}
				this.kitWelcome.file(name + '.pdf', data, {binary:true})
			}
		}

		else{
			for (let file of files) {
				let link = document.createElement('a');
				link.href = window.URL.createObjectURL(file);
				let data = await JSZipUtils.getBinaryContent(link.href);
				let name = '';
				if (file.size > 1585590 && file.size < 1595590) {
					name = 'Matriz de Escalación';
					//438006
				}
				//Aqui se va a validar primero que bandera tiene si es Alfa o virwo
				else if (file.size > 2017093 && file.size < 2037093) {
					name = 'Cobertura Virwo';
				} else {
					name = contractName;
				}
				this.kitWelcome.file(name + '.pdf', data, {binary: true});
			}
		}
		let content = await this.kitWelcome.generateAsync({type: 'blob'});
		saveAs(content, element.Contract.Contract);
		const reader = new FileReader();
		reader.onloadend = () => {
			reader.result;
		};
		let fileUrl = URL.createObjectURL(content);
		reader.readAsDataURL(content);
		this._contractService.saveContractZip(this.contracInfo.Contract, content)
		.subscribe(res => {})
		console.log('Valor de content: ', content);
		
		this.closeSnack('Contrato creado con exito, descargando kit');
	}

	async fillFile(contractInfo: any) {
		let contractPDf
		if(contractInfo.IdOwnerCompany==1 ){
			contractPDf = 'assets/docs/contrato/AlphaContrato.pdf';
		}
		else{
			contractPDf= 'assets/docs/contrato/VirwoContrato.pdf';
		}
		let headers = [
			'Fabricante',
			'Modelo',
			'Serie',
			'SLA',
			'Cantidad',
			'Data Center',
		];
		const fontSizeGeneral = 12;
		const existingPdfBytes = await fetch(contractPDf).then(res => res.arrayBuffer());
		const pdfDocByte = await PDFDocument.load(existingPdfBytes);
		const pages = pdfDocByte.getPages();
		const seconPage = pages[1];
		let xPages;
		xPages = 1;
		let actualPage = pages[xPages];
		const helveticaFont = await pdfDocByte.embedFont(StandardFonts.Helvetica);
		let contractNumberFull = contractInfo.Contract; //this.generateform.value.contractNumber;
		contractNumberFull = String(contractNumberFull);
		const dateContract = this.transformDate(contractInfo.createdAt);
		const numberCustomer = String(contractInfo.IdClient);
		let clientInfo: any = await this._contractService
			.getClientById(contractInfo.IdClient)
			.toPromise();
		const startDateContract = this.transformDate(contractInfo.StartContract);
		const endDateContract = this.transformDate(contractInfo.EndContract);
		seconPage.drawText(contractNumberFull, {
			x: 415,
			y: 713,
			size: fontSizeGeneral,
			font: helveticaFont,
		});
		seconPage.drawText(dateContract, {
			x: 415,
			y: 693,
			size: fontSizeGeneral,
			font: helveticaFont,
		});
		seconPage.drawText(numberCustomer, {
			x: 415,
			y: 673,
			size: fontSizeGeneral,
			font: helveticaFont,
		});

		if(contractInfo.NumberOrder== null || contractInfo.NumberOrder==''){
			seconPage.drawText('No hay orden asociada',{
				x: 415,
				y:653,
				size: fontSizeGeneral,
				font: helveticaFont
			});	
		}else{
			seconPage.drawText(contractInfo.NumberOrder.toString(),{
				x: 415,
				y:653,
				size: fontSizeGeneral,
				font: helveticaFont
			});	
		}

		seconPage.drawText(clientInfo.AdressFiscal, {
			x: 40,
			y: 607,
			size: fontSizeGeneral,
			font: helveticaFont,
		});

		seconPage.drawText(clientInfo.RFC, {
			x: 68,
			y: 576,
			size: 13.5,
			font: helveticaFont,
		});

		seconPage.drawText(clientInfo.RegisteredName, {
			x: 152,
			y: 540,
			size: fontSizeGeneral,
			font: helveticaFont,
		});

		seconPage.drawText(clientInfo.Name, {
			x: 135,
			y: 468,
			size: 14,
			font: helveticaFont,
		});

		seconPage.drawText(startDateContract, {
			x: 153,
			y: 368,
			size: fontSizeGeneral,
			font: helveticaFont,
		});
		seconPage.drawText(endDateContract, {
			x: 154,
			y: 337,
			size: fontSizeGeneral,
			font: helveticaFont,
		});
		
		let posY = 598; //Posicion inicial de Y para pintar las tablas en una nueva hoja y tamano de la hoja
		let posYDataCenterInnitial = 235; //Empieza a pintar las direcciones en la hoja 2
		let cellSize = 18;
		//Pintar la direccion
		let discountY = 235;
		let orderByTimeContract: any = await this.transformArrayEquipments(contractInfo.DataCenters)
		
		for(let property in orderByTimeContract){
			posYDataCenterInnitial = discountY + 5;
			let duration: any = await this._contractService.getContractTimeById(property).toPromise();
			actualPage.drawText(duration.data.Duration, {
				x:7,
				y:posYDataCenterInnitial + 11,
				size: 10.5,
				font: helveticaFont
			});

			let positionX = 7;
			let positionY = 348;
			//Encabezados
			for (let i = 0; i <= 5; i++) {
				if (discountY <= 70) {
					xPages = xPages + 1;
					posYDataCenterInnitial = 700;
					discountY = 695;
					actualPage = pages[xPages];
				}
				actualPage.drawRectangle({
					x: positionX,
					y: posYDataCenterInnitial - 10,
					width: 100,
					height: cellSize,
					borderColor: rgb(0, 0, 0),
					borderWidth: 0.2,
					color: cmyk(0.8, 0.2, 0, 0.2)
				});
				if (i == 0) {
					actualPage.drawText(headers[i], {
						x: positionX + 5,
						y: posYDataCenterInnitial - 5,
						size: 10.5,
						font: helveticaFont,
						color: cmyk(0, 0, 0, 0),
					});
					positionX = positionX + 100;
				}
				if (i == 1) {
					actualPage.drawText(headers[i], {
						x: positionX + 5,
						y: posYDataCenterInnitial - 5,
						size: 10.5,
						font: helveticaFont,
						color: cmyk(0, 0, 0, 0),
					});
					positionX = positionX + 100;
				}
				if (i == 2) {
					actualPage.drawText(headers[i], {
						x: positionX + 5,
						y: posYDataCenterInnitial - 5,
						size: 10.5,
						font: helveticaFont,
						color: cmyk(0, 0, 0, 0),
					});
					positionX = positionX + 100;
				}
				if (i == 3) {
					actualPage.drawText(headers[i], {
						x: positionX + 5,
						y: posYDataCenterInnitial - 5,
						size: 10.5,
						font: helveticaFont,
						color: cmyk(0, 0, 0, 0),
					});
					positionX = positionX + 100;
				}
				if (i == 4) {
					actualPage.drawText(headers[i], {
						x: positionX + 5,
						y: posYDataCenterInnitial - 5,
						size: 10.5,
						font: helveticaFont,
						color: cmyk(0, 0, 0, 0),
					});
					positionX = positionX + 100;
				}
				if (i == 5) {
					actualPage.drawText(headers[i], {
						x: positionX + 5,
						y: posYDataCenterInnitial - 5,
						size: 10.5,
						font: helveticaFont,
						color: cmyk(0, 0, 0, 0),
					});
					positionX = positionX + 100;
				}
			}
			discountY = discountY - cellSize - 5;
			let arrayEquipments: any = orderByTimeContract[property];
			for(let i = 0; i < arrayEquipments.length; i++){
				let equipment: any= arrayEquipments[i].Equipments
				let nameSLA:any = await this._contractService.getSlaById(arrayEquipments[i].IdSLA).toPromise()
				let nameBrand: any = await this._invetaryService.getBrandById(equipment.IdBrand).toPromise()
				let nameDataCenter: any= await this._contractService.getDataCenterById(arrayEquipments[i].IdDataCenter).toPromise();
				let positionXAux = 7;
				//Recuadros
				if(discountY <= 70){
					xPages = xPages+1;
					posYDataCenterInnitial = 598;
					discountY = 695;
					actualPage = pages[xPages];
				}
				for(let i = 0; i <= 5; i++){
					actualPage.drawRectangle({
						x:positionXAux,
						y:discountY,
						width: 100,
						height: 18,
						borderColor: rgb(0,0,0),
						borderWidth: 0.2
					});
					positionXAux = positionXAux + 100;
				}
				positionY = positionY - 18;
				positionXAux = 7;
				positionY = 348;
				actualPage.drawText(nameBrand.NameBrand ,{
					x: positionXAux + 5,
					y: discountY + 4,
					size: 7,
					font: helveticaFont,
				});
				positionXAux = positionXAux + 100;
				actualPage.drawText(equipment.Model, {
					x: positionXAux + 5,
					y: discountY + 4,
					size: 7,
					font: helveticaFont,
				});
				positionXAux = positionXAux + 100;
				actualPage.drawText(equipment.Serial, {
					x: positionXAux + 5,
					y: discountY + 4,
					size: 7,
					font: helveticaFont,
				});
				if (nameSLA.Name == null) {
					positionXAux = positionXAux + 100;
					actualPage.drawText('No existe', {
						x: positionXAux + 5,
						y: discountY + 4,
						size: 7,
						font: helveticaFont,
					});
				} else {
					positionXAux = positionXAux + 100;
					actualPage.drawText(nameSLA.Name, {
						x: positionXAux + 5,
						y: discountY + 4,
						size: 7,
						font: helveticaFont,
					});
				}
				positionXAux = positionXAux + 100;
				actualPage.drawText('1', {
					x: positionXAux + 5,
					y: discountY + 4,
					size: 7,
					font: helveticaFont,
				});
				positionXAux = positionXAux + 100;
				//Aqui me quede 
				actualPage.drawText(nameDataCenter.DataCenter, {
					x: positionXAux + 5,
					y: discountY + 4,
					size: 7,
					font: helveticaFont,
				});
				positionY = positionY - 18;
				positionXAux = 7;
				discountY = discountY - cellSize;
			}
			posY = posY - 15;
			discountY = discountY - 15;
		}
		if (xPages == 1) {
			for (let i = 0; i <= 1; i++) {
				pdfDocByte.removePage(xPages + 1);
			}
		}
		if (xPages == 2) {
			pdfDocByte.removePage(xPages + 1);
		}
		const pdfBytes = await pdfDocByte.save();
		try {
			let pdfFile = await this.savePdf('Confirmacion de contrato', pdfBytes);
			this.downloadPDF('Confirmacion de contrato', pdfFile);
			return pdfFile;
		} catch (error) {
			return NONE_TYPE;
		}
	}

	async savePdf(pdfName: any, byte: any) {
		var blob = new Blob([byte, {name: pdfName}], {type: 'application/pdf'});
		const reader = new FileReader();
		var link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		reader.readAsDataURL(blob);
		var fileName = pdfName;
		link.download = fileName;
		//link.click();
		return blob;
	}

	transformDate(date: any) {
		const day = new Date(date).getDate();
		const month = new Date(date).getMonth() + 1;
		const year = new Date(date).getFullYear();
		date = day + '/' + month + '/' + year;
		return date;
	}

	async transformArrayEquipments(array: any){
		let arrayEquipments: any=[]; 
		for(let i = 0; i < array.length; i++){
			let auxOne = array[i].DataCenterEquipment
			for(let j = 0; j < auxOne.length; j++){
				arrayEquipments.push(auxOne[j])
			}
		}
		const orderByTimeContract = groupBy(arrayEquipments, order =>{
			return order.IdContractTime
		});
		return orderByTimeContract;
	}

	async fileConvert(layout: any, name: any) {
		let layoutDoc = layout;
		const namePDf = name;
		const existingPdfBytes = await fetch(layoutDoc).then(res => res.arrayBuffer());
		const pdfDocByte = await PDFDocument.load(existingPdfBytes);
		const pdfBytes = await pdfDocByte.save();
		try {
			let pdfFile = await this.savePdf(namePDf, pdfBytes);
			this.downloadPDF(namePDf, pdfFile);
			return pdfFile;
		} catch (error) {
			return NONE_TYPE;
		}
	}

	downloadPDF(_name: string, blob: any) {
		let link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		let reader = new FileReader();
		reader.readAsArrayBuffer(blob);
	}

	closeSnack(message: any) {
		this.snackBar.open(message, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-info'],
		});
	}

	QueryErrorSnack(message: string) {
		this.snackBar.open(message, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-red'],
		});
	}
}
