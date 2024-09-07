import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { MatSort } from '@angular/material/sort';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { NONE_TYPE } from '@angular/compiler';
import * as JSZipUtils from 'jszip-utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WaitModalComponent } from '../../wait-modal/wait-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-download-pdfs',
  templateUrl: './download-pdfs.component.html',
  styleUrls: ['./download-pdfs.component.scss']
})
export class DownloadPdfsComponent implements OnInit {
  

  displayedColumns: string[] = ['ticketID', 'select'];
  allTickets : any;
  completTickets: any;
  isSelected: boolean = false;
  //ticketsCompletsFile : any[] =[];
  ticketsComplets = new JSZip();
  layoutPdf : any;
  name = 'Concentrado de PDFs'
  //dataSource = ELEMENT_DATA;
  dataSource! : MatTableDataSource<any>; 
  selectedRowIds: Set <number> = new Set<number>()
  public selIndex: number[] = [];
  dataTest:[] = this.data;
  selection = new SelectionModel<any>(false,[])
  
  

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public dataOne!: Object[];
  constructor(
    private _snackBar: MatSnackBar,
    private _ticketServices: TicketsService,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialogRef: MatDialogRef<any>,
    private dialog : MatDialog
  ) { }
    
  ngOnInit(): void {
    this.getCompleteTickets();
    console.log('El valor de data en este form es:', this.data.info);
    let dataOne = this.dataSource;
    this.selection = new SelectionModel(true, this.dataOne)
    this.selection.clear();
    console.log('El valor selection', this.selection); 
  }

  public dataBound(args:any ): void{
    const indexs : number [] = [];
    const TicketID = 'TicketID';
  }

  
  isAllSelected():boolean{
    const numSelected = this.selection.selected.length;
    //Este es el que quiero de la tabla
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(){
    //let dataOne: [] = this.data.info
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row:any) => this.selection.select(row));
  }
  
  /*
  get allSelected():boolean{
    return this.selection.selected.length === this.data.info.length
      //!!this.data.info.length &&; Many2604
      //https://github.com/thisiszoaib/angular-selection-model/blob/master/src/app/app.component.html
      //https://zoaibkhan.com/blog/create-multi-select-list-with-angular-cdk-selection-model/
  }

  toggleMasterSelection(){
    if (this.allSelected){
      this.selection.clear();      
    }
    else{
      
      this.selection.select(this.data.info)
    }
  }*/

  getCompleteTickets(){
    this._ticketServices.getAllAlarms().subscribe((res: any) => {
      this.allTickets = res;
      this.completTickets = this.allTickets.filter(( m : any) => m.stepTicket == 6);
      this.dataSource = new MatTableDataSource(this.completTickets);
      //this.selection = new SelectionModel(true, this.dataOne)
      //this.isAllSelected();
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.generateAll(this.completTickets)
      });
    });
    return this.dataSource;
  }




  ngOnChanges(): void {
    console.log('Valor de la seleccion',this.selection.selected.length);
    //this.ticketsComplets = this.selection.selected
  }
  /*
  async generateAll(){
    let ticketList: any = this.data.info;  
    console.log();
    for (let ticket of ticketList){

      if( ticket.solutionReassign != undefined){
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
    let content = await this.ticketsComplets.generateAsync({ type: 'blob'});
    saveAs(content,this.name)
    dialogRef.close();
    this.closeSnackPdf();
  }*/
  /*
  addRow(row: any){
    console.log('El boton ha sido activado', row, this.selectedRowIds.has(row));
    if(this.selectedRowIds.has(row)){
      this.selectedRowIds.delete(row)
    }
    else{
      this.selectedRowIds.add(row)
    }
    console.log(this.selectedRowIds);
  }

  getSelectedRows(){
    return Array.from<any>(this.selectedRowIds);
  }*/

  async selectPdfDownload(){
    
    this.ticketsComplets = new JSZip();
    
    //console.log(this.getSelectedRows());
    console.log('El valor de ticketListSelected', this.selection.selected);
    if(this.selection.selected.length > 0){
      for (let ticket of this.selection.selected){
        //let ticket = ticketListSelected[i];
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
      //let test = content.size;
      //test = ;
      dialogRef.close();
      this.closeSnackPdf();
    } 
    else{
      this.noSelectedSnackPdf();  
    }
  }

  async generatePdfSolution(pdfDoc: any, ticket: any){
        let fileUrl = this._ticketServices.getImage(ticket.evidence)
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
    let fileUrl = this._ticketServices.getImage(ticket.evidence)
    let fileUrlReassigned = this._ticketServices.getImage(ticket.evidenceReassig)
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

  transformDate(date:any){
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    date = day + '/' + month + '/' + year;
    return date;
  }

  errorSnack() {
    this._snackBar.open('Error al modificar el ticket, intentalo de nuevo o comunicate  con tu administrador', '', {
        duration: 3500,
        verticalPosition: 'top',
        panelClass: ['background-snack'],
    });
  }

  errorSnackPdf() {
    this._snackBar.open('El Pdf no se genero', '', {
        duration: 3500,
        verticalPosition: 'top',
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

  closeSnackPdf(){
    const msg = 'El concentrado de PDFs se genero correctamente.';
      this._snackBar.open(msg, '', {
        duration: 3500,
        verticalPosition: 'top',
        panelClass: ['background-snack'],
      });
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
