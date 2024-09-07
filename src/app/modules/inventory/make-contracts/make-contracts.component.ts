import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Data, Logger, row, setColumnIndex} from '@syncfusion/ej2-angular-grids';
import readXlsxFile from 'read-excel-file';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PDFDocument, degrees, rgb, StandardFonts, cmyk} from 'pdf-lib';
import * as JSZip from 'jszip';
import {saveAs} from 'file-saver';
import {NONE_TYPE} from '@angular/compiler';
import * as JSZipUtils from 'jszip-utils';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import * as XLSX from 'xlsx';
import {ContractsService} from 'src/app/services/contracts/contracts.service';
import Swal from 'sweetalert2';
//import {group} from 'console';
//import 'core-js/actual/array/group-by';
import {groupBy, property} from 'lodash';
import {WaitModalComponent} from 'src/app/pages/dialogs/wait-modal/wait-modal.component';
//import groupBy from 'lodash';//
//Cannot find module 'lodash.groupby' or its corresponding type declarations.ts(2307)

type AOA = any[][];

@Component({
	selector: 'app-make-contracts',
	templateUrl: './make-contracts.component.html',
	styleUrls: ['./make-contracts.component.scss'],
})
export class MakeContractsComponent implements OnInit {

	dataRows: any = [];
	dataObject: any = [
		{
			Serial: String,
			SerialProvider: String,
			Brand: String,
			Equipment: String,
			Model: String,
			Sla: String,
		},
	];

	//today's date
	todayDate: Date = new Date();
	generateform!: FormGroup;
	loading: boolean = false;
	submitted: boolean = false;
	files: any[] = [];
	displayeColumns: string[] = [
		'Serial',
		'SerialProvider',
		'Brand',
		'Equipment',
		'Model',
		'Sla',
	];
	dataTable!: MatTableDataSource<any>;
	name = 'Kit de bienvenida';
	data: any;
	headData: any; // excel row header
	isShow: boolean = false;
	dataRow: any;
	kitWelcome = new JSZip();
	zipUpload!: string;
	fileName: any;
	flag: boolean = false;
	clientsList: any;
	check = false;
	indeterminate = false;
	dataCenterList: any;
	contractTimeList: any;
	dataCenter: any;
	selectedOption!: string;
	printedOption!: string;
	selected: number = 1;
	order: any;
	stringProvider: any;
	orderArray: any = [
		{
			dataCenter: String,
			Serial: String,
			SerialProvider: String,
			brand: String,
			equipment: String,
			Model: String,
			SLA: String,
			hardwareProvider: String,
			contractTime: String,
			ip: String,
			quantity: String,
		},
	];
	orderArrayByTime: any = [
		{
			dataCenter: String,
			Serial: String,
			SerialProvider: String,
			brand: String,
			equipment: String,
			Model: String,
			SLA: String,
			hardwareProvider: String,
			contractTime: String,
			ip: String,
			quantity: String,
		},
	];
	newArray: any = []; //Para ordenar por dataCenter guardar en BD
	arrayByContractTime: any = []; //Para ordenar por el tiempo de contrato, plasmar en PDF 
	newArrayDataCenters: any = [];
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private formBuilder: FormBuilder,
		public _snackBar: MatSnackBar,
		private _contractService: ContractsService
	) {}

	ngOnInit(): void {
		this.generateform = this.formBuilder.group({
			createdAt: ['', [Validators.required]],
			IdClient: ['', [Validators.required]],
			StartContract: ['', [Validators.required]],
			EndContract: ['', [Validators.required]],
			pathZip: [''],
			layout: ['', Validators.required],
			NumOrder: ['', [Validators.required]], //9 Al final
			file: ['', [Validators.required]],
		});
		this.check = false;
		this._contractService.getAllClients().subscribe(res => {
			this.clientsList = res;
		});
		this._contractService.getAllDataCenters().subscribe(res => {
			this.dataCenterList = res;
		});
		this.disableForm();
	}

	validateCheck() {
		this.check = !this.check;
		console.log(this.check);
		if (this.check == true) {
		} else if (this.check == false) {
		}
	}

	async validateOrder() {
		console.log(this.generateform.controls.NumOrder.value);
		this.order = await this._contractService
			.getCompleteOrder(this.generateform.controls.NumOrder.value)
			.toPromise();
		if (this.order == null) {
			this.errorSnack('La orden de compra no existe');
			this.disableForm();
		} else if (this.order != null) {
			if (this.order.IdStatus != 1) {
				this.disableForm();

				this.errorSnack('La orden no esta completada');
			} else {
				this.closeSnack('Orden Completada');
				this.enableForm();
			}
		}
	}

	disableForm() {
		this.generateform.controls.IdClient.disable();
		this.generateform.controls.layout.disable();
		this.generateform.controls.StartContract.disable();
		this.generateform.controls.EndContract.disable();
		this.generateform.controls.createdAt.disable();
	}

	enableForm() {
		this.generateform.controls.IdClient.enable();
		this.generateform.controls.layout.enable();
		this.generateform.controls.StartContract.enable();
		this.generateform.controls.EndContract.enable();
		this.generateform.controls.createdAt.enable();
	}

	fileUpload(event: any) {
		let fileExcel: any = event.target.files[0];
		this.dataObject = [];
		if (fileExcel) {
			if (
				fileExcel.type ==
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			) {
				let file = readXlsxFile(fileExcel).then(async (rows: any) => {
					this.dataRows = rows;
					this.newArray = await this.transformArray(this.dataRows);
					console.warn('newArray: ', this.newArray);
					this.arrayByContractTime = await this.arrayByTimeContract(this.dataRows);
					console.warn('arrayByContractTime: ', this.arrayByContractTime);
					this.dataRows = this.dataRows.slice(1);
					for (let i = 0; i < this.dataRows.length; i++) {
						this.dataObject.push({
							Serial: this.dataRows[i][1],
							SerialProvider: this.dataRows[i][2],
							Brand: this.dataRows[i][3],
							Equipment: this.dataRows[i][4],
							Model: this.dataRows[i][5],
							Sla: this.dataRows[i][6],
						});
					}
					this.isShow = true;
					this.showFileName(fileExcel.name);
					this.dataTable = new MatTableDataSource(this.dataObject);
				});
			} else {
				this.errorSnack('Formato de archivo incorrecto, solo XLSX');
			}
		} else {
			this.errorSnack('Favor de subir un archivo');
		}
	}

	async transformArray(array: any) {
		array = array.slice(1);
		for (let i = 0; i < array.length; i++) {
			this.orderArray.push({
				dataCenter: array[i][0],
				Serial: array[i][1],
				SerialProvider: array[i][2],
				brand: array[i][3],
				equipment: array[i][4],
				Model: array[i][5],
				SLA: array[i][6],
				hardwareProvider: array[i][7],
				contractTime: array[i][8],
				ip: array[i][9],
				quantity: array[i][10],
			});
		}
		this.orderArray = this.orderArray.slice(1);
		const byDataCenter = groupBy(this.orderArray, order => {
			return order.dataCenter;
		});
		return byDataCenter;
	}

	showFileName(nameFile: any) {
		this.flag = true;
		this.fileName = nameFile;
		Swal.fire({
			title: `Archivo cargado con exito.`,
			showConfirmButton: false,
			icon: 'success',
			timer: 3000,
			width: '300px',
		});
	}

	onFileDropped(event: any) {
		this.prepareFilesList(event);
		this.dataObject = [];
		let fileExcel;
		if (event.length <= 1) {
			for (const file of event) {
				fileExcel = file;
			}
			let readFile = readXlsxFile(fileExcel).then((rows: any) => {
				this.dataRows = rows;
				this.dataRows = this.dataRows.slice(1);
				for (let i = 0; i < this.dataRows.length; i++) {
					this.dataObject.push({
						fabricante: this.dataRows[i][0],
						modelo: this.dataRows[i][1],
						serie: this.dataRows[i][2],
						sla: this.dataRows[i][3],
						cantidad: this.dataRows[i][4],
						tiempoSoporte: this.dataRows[i][5],
					});
				}
				this.isShow = true;
				this.dataTable = new MatTableDataSource(this.dataObject);
			});
		}
		if (event.length > 1) {
			this.errorSnackUploadFile();
			this.isShow = false;
		}
	}

	prepareFilesList(files: any) {
		for (const item of files) {
			item.progress = 0;
			this.files.push(item);
		}
		this.uploadFilesSimulator(0);
	}

	uploadFilesSimulator(index: number) {
		setTimeout(() => {
			if (index === this.files.length) {
				return;
			} else {
				const progressInterval = setInterval(() => {
					if (this.files[index].progress === 100) {
						clearInterval(progressInterval);
						this.uploadFilesSimulator(index + 1);
					} else {
						this.files[index].progress += 5;
					}
				}, 200);
			}
		}, 1000);
	}

	formatBytes(bytes: any) {
		if (bytes === 0) {
			return '0 Bytes';
		}
		const k = 1024;
		//const dm = decimals <= 0 ? 0 : decimals || 2;
		const dm = 0.0;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	deleteFile(index: number) {
		this.files.splice(index, 1);
	}

	async generateContractZip() {
		Swal.fire({
			customClass: 'swal-height',
			width: 0,
			timer: 5000,
			showConfirmButton: false,
			backdrop: `
						rgba(221,241,249,0.4)
						url("/assets/gifs/Antena-1-unscreen.gif")
						center
						no-repeat
					`,
		});
		this.submitted = true;
		this.kitWelcome = new JSZip();
		//console.log('Test del nuevo array en gerate contract: ', this.newArray);

		if (this.dataObject.length <= 1) {
			this.errorSnack('Favor de adjuntar un archivo xlsx');
			return;
		}
		this.loading = true;
		let contractInfo: any = await this.createNewContract(this.generateform.value);
		await this.saveEquipments(contractInfo, this.newArray)
		let flagLayout: any = this.generateform.controls.layout.value;
		let coverage;
		let scalingMatrix;

		if (flagLayout == 1) {
			coverage = 'assets/docs/contrato/Cobertura_Alpha.pdf';
			scalingMatrix = 'assets/docs/contrato/Matriz_alpha.pdf';
		} else {
			coverage = 'assets/docs/contrato/Cobertura_Virwo.pdf';
			scalingMatrix = 'assets/docs/contrato/Matriz_escalacion.pdf';
		}
		let contractName: any = contractInfo.Contract;
		let coverageFile = await this.fileConvert(coverage, 'Cobertura');
		let matrixFile = await this.fileConvert(scalingMatrix, 'Matriz de escalacion');
		let contract: any = await this.fillFile(contractInfo, this.arrayByContractTime);
		let files = [coverageFile, matrixFile, contract];
		//Para Alpha
		if (flagLayout == 1) {
			for (let file of files) {
				let link = document.createElement('a');
				link.href = window.URL.createObjectURL(file);
				let data = await JSZipUtils.getBinaryContent(link.href);
				let name = '';
				if (file.size > 1588818 && file.size < 1598918) {
					name = 'Matriz de Escalación';
				}
				//Aqui se va a validar primero que bandera tiene si es Alfa o virwo 172.6.3.4
				else if (file.size > 1132560 && file.size < 1200000) {
					name = 'Cobertura Alpha';
				} else {
					name = contractName;
				}
				this.kitWelcome.file(name + '.pdf', data, {binary: true});
			}
		}
		//Para Virwo 
		else {
			for (let file of files) {
				let link = document.createElement('a');
				link.href = window.URL.createObjectURL(file);
				let data = await JSZipUtils.getBinaryContent(link.href);
				let name = '';
				//1585690
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
		saveAs(content, contractName);
		const reader = new FileReader();
		reader.onloadend = () => {
			reader.result;
		};
		let fileUrl = URL.createObjectURL(content);
		reader.readAsDataURL(content);
		this.closeSnack('Contrato creado con exito, descargando kit');
		this._contractService.postFilesContracts(contractInfo, content).subscribe(_res => {});
		location.reload();
	}


	get clientName() {
		const id = this.generateform.value.IdClient;
		const client = this.clientsList.find((client: any) => client.IdClient == id);
		return client.Name;
	}

	async fillFile(contractInfo: any, timesSupport: any) {
		let flagLayout: any = this.generateform.controls.layout.value;
		let contractPDf;
		if (flagLayout == 1) {
			contractPDf = 'assets/docs/contrato/AlphaContrato.pdf';
		} else {
			contractPDf = 'assets/docs/contrato/VirwoContrato.pdf';
		}
		let headers = [
			'Fabricante',
			'Modelo',
			'Serie',
			'SLA',
			'Cantidad',
			'Data Center',
		];
		const fontSize = 9;
		const fontSizeData = 10;
		const fontSizeGeneral = 12;
		const namePDf = 'Conformacion de contrato';
		const existingPdfBytes = await fetch(contractPDf).then(res => res.arrayBuffer());
		const pdfDocByte = await PDFDocument.load(existingPdfBytes);
		const pages = pdfDocByte.getPages();
		const firstPage = pages[0];
		const seconPage = pages[1];
		const thirdPage = pages[3];
		let xPages: any=1;
		//xPages = 1;
		let actualPage: any = pages[xPages];
		const helveticaFont = await pdfDocByte.embedFont(StandardFonts.Helvetica);
		const contractNumberFull = contractInfo.Contract;
		const dateContract = this.transformDate(this.generateform.value.createdAt);
		const numberCustomer = this.clientName;
		const clientId = contractInfo.IdClient.toString();
		let clientInfo: any = await this._contractService
			.getClientById(contractInfo.IdClient)
			.toPromise();
		const startDateContract = this.transformDate(this.generateform.value.StartContract);
		const endDateContract = this.transformDate(this.generateform.value.EndContract);
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
		seconPage.drawText(clientId, {
			x: 415,
			y: 673,
			size: fontSizeGeneral,
			font: helveticaFont,
		});
		seconPage.drawText(this.generateform.value.NumOrder.toString(), {
			x: 415,
			y: 653,
			size: fontSizeGeneral,
			font: helveticaFont,
		});
		seconPage.drawText(clientInfo.AdressFiscal, {
			x: 40,
			y: 607,
			size: fontSizeGeneral,
			font: helveticaFont,
		});

		seconPage.drawText(clientInfo.RFC, {
			x: 68,
			y: 576,
			size: fontSizeGeneral,
			font: helveticaFont,
		});

		seconPage.drawText(clientInfo.RegisteredName, {
			x: 152,
			y: 540,
			size: fontSizeGeneral,
			font: helveticaFont,
		});
		seconPage.drawText(numberCustomer, {
			x: 135,
			y: 468,
			size: fontSizeGeneral,
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
		//console.warn('Valor de dataCenters antes de traer direccione', dataCenters);
		let listDataCenters: any = [];
		let discountY = 235;
		//Aqui se metera todo lo de las tablas
		for (var property in timesSupport) {
			posYDataCenterInnitial = discountY + 5;
			//Pintar los meses de oporte
			actualPage.drawText(property, {
					x: 7,
					y: posYDataCenterInnitial + 11,
					size: 11,
					font: helveticaFont,
			});
			//Pintar en encabezados de acuerdo a el numero de dataCenters Y=370
			/*-----------------------------------------------------------*/
			let positionX = 7;
			let positionY = 348;

			for (let i = 0; i <= 5; i++) {
				if (discountY <= 70) {
					xPages = xPages + 1;
					//Aqui debe de haber un salto de pagina
					//Deben de cambiar los valores de discountY
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
					color: cmyk(0.8, 0.2, 0, 0.2),
				});
				/*Aqui se ira distinguiendo cada uno de los encabezados y se recorrera
					cada uno de los textos a modo que quede centrado
				*/
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
			let auxData = timesSupport[property];
			//Aqui ya accedo a los elementos del arreglo
			//let positionYone: number = 0;
			let positionXAux = 7;
			for (let i = 0; i < auxData.length; i++) {
				if (discountY <= 70) {
					xPages = xPages + 1;
					//Aqui debe de haber un salto de pagina
					//Deben de cambiar los valores de discountY
					//Deben de cambiar los valores de discountY
					posYDataCenterInnitial = 598;
					discountY = 695;
					actualPage = pages[xPages];
				}
				for (let j = 0; j <= 5; j++) {
					actualPage.drawRectangle({
						x: positionXAux,
						y: discountY,
						width: 100,
						height: 18,
						borderColor: rgb(0, 0, 0),
						borderWidth: 0.2,
					});
					positionXAux = positionXAux + 100;
				}
				positionY = positionY - 18;
				positionXAux = 7;
				//Dibujar Contenido
				positionY = 348;
				this.stringProvider = this.countChracters(auxData[i].hardwareProvider);
				if (this.stringProvider >= 27) {
				}
				actualPage.drawText(auxData[i].brand, {
					x: positionXAux + 5,
					y: discountY + 4,
					size: 7,
					font: helveticaFont,
				});
				positionXAux = positionXAux + 100;
				actualPage.drawText(auxData[i].Model, {
					x: positionXAux + 5,
					y: discountY + 4,
					size: 7,
					font: helveticaFont,
				});
				positionXAux = positionXAux + 100;
				actualPage.drawText(auxData[i].Serial, {
					x: positionXAux + 5,
					y: discountY + 4,
					size: 7,
					font: helveticaFont,
				});
				if (auxData[i].SLA == null) {
					positionXAux = positionXAux + 100;
					actualPage.drawText('No existe', {
						x: positionXAux + 5,
						y: discountY + 4,
						size: 7,
						font: helveticaFont,
					});
				} else {
					positionXAux = positionXAux + 100;
					actualPage.drawText(auxData[i].SLA, {
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
				actualPage.drawText(auxData[i].dataCenter, {
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
			//pdfDocByte.removePage(xPages+1)
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
			this.errorSnack('No se genero el PDF');
			return NONE_TYPE;
		}
	}

	async saveEquipments(contractInfo:any,equipmentArray: any){
		for(let property in equipmentArray){
			let auxData = equipmentArray[property];
			this._contractService.postEquipments(contractInfo,property, auxData).subscribe(_res=>{})
		}
	}

	arrayByTimeContract(array: any){
		console.log('Array ', array);
		array = array.slice(1);
		for (let i = 0; i < array.length; i++) {
			this.orderArrayByTime.push({
				dataCenter: array[i][0],
				Serial: array[i][1],
				SerialProvider: array[i][2],
				brand: array[i][3],
				equipment: array[i][4],
				Model: array[i][5],
				SLA: array[i][6],
				hardwareProvider: array[i][7],
				contractTime: array[i][8],
				ip: array[i][9],
				quantity: array[i][10],
			});
		}
		this.orderArrayByTime = this.orderArrayByTime.slice(1);
		const byContractTime = groupBy(this.orderArrayByTime, order => {
			return order.contractTime;
		});
		return byContractTime;	
	}

	trasformDataCenter(dataCenter: any) {
		
		let dataCenterConvert: any;
		dataCenterConvert =
			dataCenter.DataCenter +
			' ' +
			dataCenter.Street +
			' ' +
			dataCenter.ExternalNumber +
			' ' +
			dataCenter.InternalNumber +
			' ' +
			dataCenter.Neighborhood +
			' ' +
			dataCenter.PostalCode +
			' ' +
			dataCenter.Delegation +
			' ' +
			dataCenter.CityName +
			' ' +
			dataCenter.CountryName;
		dataCenterConvert = dataCenterConvert.match(/.{1,130}/g);
		return dataCenterConvert;
	}

	countChracters(word: String) {
		return word.length;
	}
	convertToString(word: any) {
		return word;
	}

	async fileConvert(layout: any, name: any) {
		let layoutDoc = layout;
		const namePDf = name;
		const existingPdfBytes = await fetch(layoutDoc).then(res => res.arrayBuffer());
		const pdfDocByte = await PDFDocument.load(existingPdfBytes);
		const pages = pdfDocByte.getPages();
		const pdfBytes = await pdfDocByte.save();
		try {
			let pdfFile = await this.savePdf(namePDf, pdfBytes);
			//this.downloadPDF(namePDf, pdfFile);
			return pdfFile;
		} catch (error) {
			this.errorSnack('No se genero el PDF');
			return NONE_TYPE;
		}
	}

	transformDate(date: any) {
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		date = day + '/' + month + '/' + year;
		return date;
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

	downloadPDF(_name: string, blob: any) {
		let link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		let reader = new FileReader();
		reader.readAsArrayBuffer(blob);
	}

	async createNewContract(generateForm: any) {
		return await this._contractService.createContract(generateForm).toPromise();
	}

	catchIdAdress(event: any) {
		//return this._contractService.getContractById(event).subscribe()
		this._contractService.getDataCenterById(event).subscribe(res => {
			this.dataCenter = res;
			return this.dataCenter;
		});
	}

	closeSnackGood() {
		this._snackBar.open('Contrato Generado', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-info'],
		});
	}

	closeSnackBad() {
		this._snackBar.open('Contrato no generado', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-red'],
		});
	}

	closeSnack(message: any) {
		this._snackBar.open(message, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-info'],
		});
	}

	errorSnack(message: any) {
		this._snackBar.open(message, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-red'],
		});
	}

	errorSnackUploadFile() {
		this._snackBar.open('Solo se permite 1 archivo', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-red'],
		});
	}

	errorSnackFieldRequired() {
		this._snackBar.open('Favor de llenar todos los campos', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-red'],
		});
	}

	savePdfTest(pdfName: any, byte: any) {
		var blob = new Blob([byte], {type: 'application/pdf'});
		var link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		var fileName = pdfName;
		link.download = fileName;
		link.click();
	}
}


