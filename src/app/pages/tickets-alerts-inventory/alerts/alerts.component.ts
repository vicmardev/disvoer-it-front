
import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
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
    ApexFill
} from 'ng-apexcharts';
import { PDFDocument, degrees, rgb, StandardFonts, lowSurrogate } from 'pdf-lib';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { NONE_TYPE } from '@angular/compiler';
import * as JSZipUtils from 'jszip-utils';
import { DownloadPdfsComponent } from '../../dialogs/ticket-alert/download-pdfs/download-pdfs.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { WaitModalComponent } from '../../dialogs/wait-modal/wait-modal.component';

export type ChartOptions = {
    series: ApexNonAxisChartSeries,
    chart: ApexChart,
    dataLabels: ApexDataLabels,
    plotOptions: ApexPlotOptions,
    responsive: ApexResponsive[],
    xaxis: ApexXAxis,
    legend: ApexLegend,
    fill: ApexFill
}


@Component({
    selector: 'app-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
    displayedColumns = [
        'select',
        'ticketID',
        'host',
        'statusTicket',
        'stepTicket',
        'ticketRegistrationDate',
        /* 'contrato' */
    ];

    startDate: any;
    endDate: any;
    
    allTickets: any;
    idTicketSelect: string = '';
    element: any = document.getElementById('checkSelect');
    rowSelect: any;
    selectedRowIndex: number = -1;
    listCard: any[] = [];
    flagDivComponet: boolean = false;
    ticketsComplets = new JSZip();
    zipName: string = 'Tickets-Completos.zip'
    layoutPdf : any;
    name = 'Concentrado de PDFs'
    saveAs:any;
    phaseTicket: number = 0;
    dataSource!: MatTableDataSource<any>;
    selection = new SelectionModel<any>(false, []);
    @ViewChild('chart')
    chart!: Highcharts.Chart;
    isShow:  boolean = false;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('stepper', { read: MatStepper }) stepper!: MatStepper;
    public dataOne!: Object[];
    public chartOptionsTotal!: Partial<ChartOptions> | any;
    public chartOptionsPending!: Partial<ChartOptions> | any;
    public chartOptionsCancel!: Partial<ChartOptions> | any;
    public chartOptionsComplete!: Partial<ChartOptions> | any;
    public chartOptionsReassigned!: Partial<ChartOptions> | any;


    totalCount = 0;
    pendingCount = 0;
    canceledCount = 0;
    completeCount = 0;
    reassignedCount = 0;

    constructor(
        private _ticketsService: TicketsService,
        private _snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.isShow = false
        this.getAllTickets();
        let dataOne = this.dataSource
        this.selection = new SelectionModel(true, this.dataOne)
        this.selection.clear();
        console.log('Valor de selection', this.selection);

        
    }

    getAllTickets() {
        this._ticketsService.getAllAlarms().subscribe((res: any) => {
            this.allTickets = res;
            this.dataSource = new MatTableDataSource(this.allTickets);
            console.log('All Tickets', this.dataSource);
                
            setTimeout(() => {
                for(let ticket of this.allTickets){
                    if(ticket.stepTicket === 6){
                        
                        this.phaseTicket = ticket.stepTicket
                        this.isShow = true;
                        console.log('this.phaseTicket', this.phaseTicket);
                    }else{
                        //this.element.style.display = 'block';
                    }
                }
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

            });
            this.totalCount = this.allTickets.length;
            this.pendingCount = this.allTickets.filter((m: any) => m.statusTicket === 'Pending').length
            this.canceledCount = this.allTickets.filter((m: any) => m.statusTicket === 'Canceled').length
            this.completeCount = this.allTickets.filter((m: any) => m.statusTicket === 'Complete').length
            this.reassignedCount = this.allTickets.filter((m: any) => m.statusTicket === 'Reassigned').length
            //this.phaseTicket = this.allTickets.filter((m : any) => m.stepTicket === 6)
            //console.log('Valor de tickets en paso 6', this.phaseTicket);
            this.countBoxes(this.allTickets);
            this.createGraph();
            return this.dataSource
        })
    }

    exportPdfDialog(){
        this.completeCount = this.allTickets.filter((m: any) => m.stepTicket == 6);

        console.log('Se abre el dialogo');
        const dialogRef = this.dialog.open(DownloadPdfsComponent, {
            width: '580px',
            height: '630px',
            data:{
                info: this.completeCount
            }
        });
    }

    isAllSelected(): boolean{
        const numSelected = this.selection.selected.length;
        const numRows =this.dataSource.data.length
        return numSelected === numRows;

    }

    masterToggle(){
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row : any) => this.selection.select(row))
    }

    async selectPdFDownload(){
        this.ticketsComplets = new JSZip();
        console.log('El valor de selection es ', this.selection.selected);
        if(this.selection.selected.length > 0){
            for(let ticket of this.selection.selected){
                if (ticket.solution == undefined || ticket.stepTicket < 6){
                    continue;
                }
                if(ticket.solutionReassign != undefined){
                    this.layoutPdf = 'assets/docs/Tickets_reasignacion.pdf';
                    let ticketPdf:any = await this.generatePdfReassign(this.layoutPdf, ticket)
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(ticketPdf);
                    let data = await JSZipUtils.getBinaryContent(link.href);
                    this.ticketsComplets.file(ticket.ticketID + '.pdf', data,{binary: true})
                }
                else{
                    this.layoutPdf = 'assets/docs/Tickets_solucion.pdf'
                    let ticketPdf:any = await this.generatePdfSolution(this.layoutPdf, ticket)
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(ticketPdf);
                    let data = await JSZipUtils.getBinaryContent(link.href);
                    this.ticketsComplets.file(ticket.ticketID + '.pdf', data,{binary: true})
                }
            }
            const dialogRef = this.dialog.open(WaitModalComponent,{
                width: 'auto',
                height:'auto',
              });
            this.ticketsComplets.files.remove;
            let content = await this.ticketsComplets.generateAsync({ type: 'blob'});
            saveAs(content,this.name);
            dialogRef.close();
            this.closeSnackPdf();
        }
        else{
            this.noSelectedSnackPdf();  
        }
    }

    async generatePdfSolution(pdfDoc: any, ticket: any){
        let fileUrl = this._ticketsService.getImage(ticket.evidence)
        const existingPdfBytes = await fetch(pdfDoc).then(res => res.arrayBuffer());
        const pdfDocByte = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDocByte.getPages();
        const firstPage = pages[0];
        const secondPage = pages[1];
        const { width, height } = firstPage.getSize();
        const helveticaFont = await pdfDocByte.embedFont(StandardFonts.Helvetica);
        const dateAlert = this.transformDate(new Date(ticket.dateAlert));
        const dateRegistration = this.transformDate(new Date(ticket.ticketRegistrationDate));
        const dateSolution = this.transformDate(new Date(ticket.dateSolution));
        const durationAlert = ticket.alertDuration;
        const string = ticket.location;
        const length = 50;
        const location = string.substring(0, length);
        /*Detail Ticket*/
        firstPage.drawText(ticket.ticketID, {x: 339, y: 718, size: 17, font: helveticaFont});
        firstPage.drawText(ticket.titleTicket, {x: 160, y: 660, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.contract, {x: 125, y: 637, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.affectedPart, {x: 161, y: 614, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.host, {x: 100, y: 591, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.statusHost, {x: 161, y: 568, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.brand, {x: 110, y: 545, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.model, {x: 116, y: 522, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.serial, {x: 104, y: 499, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.statusTicket, {x: 168, y: 476, size: 12, font: helveticaFont});
        firstPage.drawText(dateRegistration, {x: 230, y: 453, size: 12, font: helveticaFont});
        firstPage.drawText(dateAlert, {x: 165, y: 430, size: 12, font: helveticaFont});
        firstPage.drawText(durationAlert, {x: 182, y: 407, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.userClient, {x: 113, y: 384, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.userEmail, {x: 171, y: 361, size: 12, font: helveticaFont});
        firstPage.drawText(location, {x: 133, y: 338, size: 12, font: helveticaFont});
        //Second page
        /*Support Response */
        firstPage.drawText(dateSolution, {x: 460 , y: 796, size: 12, font: helveticaFont });
        secondPage.drawText(dateSolution, {x: 460 , y: 796, size: 12, font: helveticaFont });
        secondPage.drawText(ticket.ticketID, {x: 339, y: 714, size: 17, font: helveticaFont});
        secondPage.drawText(ticket.solution, {x: 131, y: 645, size: 12, font: helveticaFont});
        secondPage.drawText(ticket.supportAssignment, {x: 146, y: 624, size: 12, font: helveticaFont});
        secondPage.drawText(dateSolution, {x: 177, y: 603, size: 12, font: helveticaFont});
        //secondPage.drawText(fileUrl, {x: 85, y: 250, size: 12, font: helveticaFont});
        secondPage.drawText(fileUrl, {x: 62, y: 545,size: 12, font: helveticaFont, color: rgb(0, 0.53, 0.71)});
        const pdfBytes = await pdfDocByte.save();
        try {
          let pdfTicket = await this.savePdf(ticket.ticketID, pdfBytes);
          this.downloadPDF(ticket.ticketID, pdfTicket);
          //this.closeSnack();
          return pdfTicket;
        }
        catch(error){
          this.errorSnack();
          return NONE_TYPE
        }
    }


    async generatePdfReassign(pdfDoc: any, ticket: any){
        console.log("Se toma el layout 2", pdfDoc);
        const existingPdfBytes = await fetch(pdfDoc).then(res => res.arrayBuffer());
        const pdfDocByte = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDocByte.getPages();
        const firstPage = pages[0];
        const secondPage = pages[1];
        const thirdPage = pages [2];
        const { width, height } = firstPage.getSize();
        const helveticaFont = await pdfDocByte.embedFont(StandardFonts.Helvetica);
        const dateAlert = this.transformDate(new Date(ticket.dateAlert));
        const dateRegistration = this.transformDate(new Date(ticket.ticketRegistrationDate));
        const dateSolution = this.transformDate(new Date(ticket.dateSolution));
        const durationAlert = ticket.alertDuration;
        const dateSolutionReassig = this.transformDate(new Date(ticket.dateSolutionReassig));
        const string = ticket.location;
        const length = 50;
        const location = string.substring(0, length);
        let fileUrl = this._ticketsService.getImage(ticket.evidence)
        let fileUrlReassigned = this._ticketsService.getImage(ticket.evidenceReassig)
        /*Detail Ticket*/
        firstPage.drawText(ticket.ticketID, {x: 339, y: 718, size: 17, font: helveticaFont});
        firstPage.drawText(ticket.titleTicket, {x: 160, y: 660, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.contract, {x: 125, y: 637, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.affectedPart, {x: 161, y: 614, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.host, {x: 100, y: 591, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.statusHost, {x: 161, y: 568, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.brand, {x: 110, y: 545, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.model, {x: 116, y: 522, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.serial, {x: 104, y: 499, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.statusTicket, {x: 168, y: 476, size: 12, font: helveticaFont});
        firstPage.drawText(dateRegistration, {x: 230, y: 453, size: 12, font: helveticaFont});
        firstPage.drawText(dateAlert, {x: 165, y: 430, size: 12, font: helveticaFont});
        firstPage.drawText(durationAlert, {x: 182, y: 407, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.userClient, {x: 113, y: 384, size: 12, font: helveticaFont});
        //firstPage.drawText(ticket.userPhone, {x: 188, y: 361, size: 12, font: helveticaFont});
        firstPage.drawText(ticket.userEmail, {x: 171, y: 361, size: 12, font: helveticaFont});
        firstPage.drawText(location, {x: 133, y: 338, size: 12, font: helveticaFont}); //338
        firstPage.drawText(dateSolution, {x: 460 , y: 796, size: 12, font: helveticaFont });
        //Second page
        /*Support Response */
        secondPage.drawText(dateSolution, {x: 460 , y: 796, size: 12, font: helveticaFont });
        secondPage.drawText(ticket.ticketID, {x: 339, y: 714, size: 17, font: helveticaFont});
        secondPage.drawText(ticket.solution, {x: 131, y: 645, size: 12, font: helveticaFont});
        secondPage.drawText(ticket.supportAssignment, {x: 146, y: 624, size: 12, font: helveticaFont});
        secondPage.drawText(dateSolution, {x: 177, y: 603, size: 12, font: helveticaFont});
        secondPage.drawText(fileUrl, {x: 62, y: 545,size: 12, font: helveticaFont, color: rgb(0, 0.53, 0.71)});
        /*Response Ressign*/
        thirdPage.drawText(dateSolutionReassig, {x: 460, y: 796, size: 12, font: helveticaFont });
        thirdPage.drawText(ticket.ticketID, {x: 339, y: 714, size: 17, font: helveticaFont});
        thirdPage.drawText(ticket.solutionReassig, {x: 131 , y: 645, size: 12, font: helveticaFont });
        thirdPage.drawText(ticket.responsableReassig, {x: 146 , y: 624, size: 12, font: helveticaFont });
        thirdPage.drawText(dateSolutionReassig, {x: 177, y: 603, size: 13, font: helveticaFont });
        thirdPage.drawText(fileUrlReassigned, {x: 62, y: 545, size: 12, font: helveticaFont, color: rgb(0, 0.53, 0.71)});
    
        const pdfBytes = await pdfDocByte.save();
        try {
          let pdfTicket = await this.savePdf(ticket.ticketID, pdfBytes);
          this.downloadPDF(ticket.ticketID, pdfTicket);
          //this.closeSnackPdf();
          return pdfTicket;
        }catch(error){
          this.errorSnackPdf();
          return NONE_TYPE
        }
    
    }

    transformDate(date:any){
        const day = date.getDate();
        const month = date.getMonth()+1;
        const year = date.getFullYear();
        date = day + '/' + month + '/' + year;
        return date;
    }

    async savePdf(pdfName:any, byte:any){
        var blob = new Blob([byte], {type: "application/pdf"});
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return blob
    }

    downloadPDF(name:string, blob:any){
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
    }

    closeSnack() {
        const msg = 'Ticket Actualizado con Exito.';
        this._snackBar.open(msg, '', {
          duration: 1000,
          panelClass: ['background-snack'],
        });
    }
    
    errorSnack() {
        this._snackBar.open('Error al modificar el ticket, intentalo de nuevo o comunicate  con tu administrador', '', {
            duration: 1000,
            panelClass: ['background-snack'],
        });
    }

    closeSnackPdf() {
        const msg = 'El concentrado de PDFs se genero correctamente.';
        this._snackBar.open(msg, '', {
          duration: 1000,
          panelClass: ['background-snack'],
        });
    }
    
    errorSnackPdf() {
        this._snackBar.open('El Pdf no se genero', '', {
            duration: 1000,
            panelClass: ['background-snack'],
        });
    }

    noSelectedSnackPdf() {
        this._snackBar.open('Debe seleccionar al menos un ticket', '', {
            duration: 3500,
            verticalPosition: 'top',
            panelClass: ['background-snack'],
        });
      }

    getUniqueId(row: any) {
        this.flagDivComponet = false;
        this.rowSelect = '';
        this.idTicketSelect = row.ticketID;
        this.rowSelect = row;
        this.flagDivComponet = true;
        console.log(this.rowSelect)
        this.phaseTicket = this.rowSelect.stepTicket
        console.log('El valor del paso del ticket es',this.phaseTicket);
    }

    applyFilter(event: Event) {
        const filtro = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filtro.trim().toLowerCase();
        filtro === '' || filtro.length === 1
            ? ''
            : this._snackBar.open(
                `Existen ${this.dataSource.filter.length} registros.`,
                '',
                {
                    duration: 3500,
        verticalPosition: 'top',
                    panelClass: ['background-snack-info'],
                }
            );
    }
    highlight(row: any) {
        this.selectedRowIndex = row;
    }

    countBoxes(lisTickets: any) {
        this.listCard = [{
            title: 'Total',
            cout: lisTickets.length,
            imgHeader: 'boxTotal',
            class: 'gray'
        },
        {
            title: 'Pendiente',
            cout: lisTickets.filter((m: any) => m.statusTicket === 'Pending').length,
            imgHeader: 'boxWarning',
            class: 'pendig'

        },
        {
            title: 'Cancelado',
            cout: lisTickets.filter((n: any) => n.statusTicket === 'Canceled').length,
            imgHeader: 'boxDanger',
            class: 'canceled'

        },
        {
            title: 'Completado',
            cout: lisTickets.filter((n: any) => n.statusTicket === 'Complete').length,
            imgHeader: 'boxOk',
            class: 'complete'

        },
        {
            title: 'Reasignado',
            cout: lisTickets.filter((n: any) => n.statusTicket === 'Reassigned').length,
            imgHeader: 'boxOk',
            class: 'reasign'

        },
        ]
    }

    filterStatus(status: string) {
        console.log(status);
        if (status === 'Total') {
            this.dataSource = this.allTickets;
        } else {
            this.dataSource = this.allTickets.filter((n: any) => n.statusTicket === status);
        }
    }

    createGraph() {

        this.chartOptionsTotal = {
            colors: ['#efcc00', '#cc4c32', '#2db674', '#6E6E6E'],
            /* series: [this.pendingCount, this.canceledCount, this.completeCount, this.reassignedCount], */
            series: [((this.pendingCount / this.totalCount) * 100).toFixed(2),
            ((this.canceledCount / this.totalCount) * 100).toFixed(2),
            ((this.completeCount / this.totalCount) * 100).toFixed(2),
            ((this.reassignedCount / this.totalCount) * 100).toFixed(2)],
            chart: {
                /*  align: 'center', */
                height: 245,
                type: "radialBar",
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: false,
                    top: 8,
                    left: 1,
                    blur: 3,
                    color: ['#000'],
                    opacity: 0.35
                }
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: "14px"
                        },
                        value: {
                            fontSize: "14px"
                        },
                        total: {
                            show: true,
                            label: `Totales: ${this.totalCount}`,
                            formatter: function () {
                                return "";
                            }
                        }
                    }
                }
            },
            title: {
                /* text: `Tickets Totales: ${this.totalCount}`, */
                /* align: 'center', */
                style: {
                    fontSize: '14px',
                    color: '#646460',
                    dropShadow: {
                        enabled: true,
                        enabledOnSeries: false,
                        top: 8,
                        left: 1,
                        blur: 3,
                        color: ['#000'],
                        opacity: 0.35
                    }
                },
            },
            labels: ['Pendientes', 'Cancelados', 'Completos', 'Reasignados'],
            responsive: [
                {
                    breakpoint: 100,
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


        this.chartOptionsPending = {
            colors: ['#efcc00'],
            series: [((this.pendingCount / this.totalCount) * 100).toFixed(2)],
            chart: {
                /*  align: 'center', */
                height: 245,
                type: "radialBar",
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: false,
                    top: 8,
                    left: 1,
                    blur: 3,
                    color: ['#000'],
                    opacity: 0.35
                }
            },
            title: {
                /* text: `Tickets : ${this.pendingCount}`, */
                /* align: 'center', */
                style: {
                    fontSize: '5px',
                    color: '#efcc00',
                },
            },
            labels: [`Pendientes: ${this.pendingCount}`],
            responsive: [
                {
                    breakpoint: 100,
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


        this.chartOptionsCancel = {
            colors: ['#cc4c32'],
            series: [((this.canceledCount / this.totalCount) * 100).toFixed(2)],
            chart: {
                /* align: 'center', */
                height: 245,
                type: "radialBar",
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: false,
                    top: 8,
                    left: 1,
                    blur: 3,
                    color: ['#000'],
                    opacity: 0.35
                }
            },
            title: {
                /* text: `Tickets : ${this.canceledCount}`, */
                /* align: 'center', */
                style: {
                    fontSize: '5px',
                    color: '#cc4c32',
                },
            },
            labels: [`Cancelados: ${this.canceledCount}`],
            responsive: [
                {
                    breakpoint: 100,
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


        this.chartOptionsComplete = {
            colors: ['#2db674'],
            series: [((this.completeCount / this.totalCount) * 100).toFixed(2)],
            chart: {
                /*  align: 'center', */
                height: 245,
                type: "radialBar",
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: false,
                    top: 8,
                    left: 1,
                    blur: 3,
                    color: ['#000'],
                    opacity: 0.35
                }
            },
            title: {
                /* text: `Tickets : ${this.completeCount}`, */
                /* align: 'center', */
                style: {
                    fontSize: '5px',
                    color: '#2db674',
                },
            },
            labels: [`Completos: ${this.completeCount}`],
            responsive: [
                {
                    breakpoint: 100,
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


        this.chartOptionsReassigned = {
            colors: ['#6E6E6E'],
            series: [((this.reassignedCount / this.totalCount) * 100).toFixed(2)],
            chart: {
                /* align: 'center', */
                height: 245,
                type: "radialBar",
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: false,
                    top: 8,
                    left: 1,
                    blur: 3,
                    color: ['#000'],
                    opacity: 0.35
                }
            },
            title: {
                /* text: `Tickets : ${this.reassignedCount}`, */
                /* align: 'center', */
                style: {
                    fontSize: '5px',
                    color: '#6E6E6E',
                    dropShadow: {
                        enabled: true,
                        enabledOnSeries: false,
                        top: 8,
                        left: 1,
                        blur: 3,
                        color: ['#000'],
                        opacity: 0.35
                    }
                },
            },
            labels: [`Reasignados: ${this.reassignedCount}`],
            responsive: [
                {
                    breakpoint: 100,
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

    // Filter by date

startChange(event: any) {
    this.startDate = event.value;
  }

  endChange(event: any) {
    this.endDate = event.value;
    let start = this.startDate.toISOString().substr(0, 10);
    let end = this.endDate.toISOString().substr(0, 10);
    const searchResult = this.allTickets.filter(
      (dev: any) =>
        dev.ticketRegistrationDate.substring(0, 10) >= start && dev.ticketRegistrationDate.substring(0, 10) <= end
    );
    this.dataSource.data = searchResult;
    if (searchResult.length == 0) {
      this._snackBar.open('No existen registros en estas Fechas.', '', {
        duration: 3500,
        verticalPosition: 'top',
        panelClass: ['background-snack-red'],
      });
    } else {
      this._snackBar.open(`Existen ${searchResult.length} registros.`, '', {
        duration: 3500,
        verticalPosition: 'top',
        panelClass: ['background-snack-info'],
      });
    }
  }

}


