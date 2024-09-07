import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-close-download',
  templateUrl: './close-download.component.html',
  styleUrls: ['./close-download.component.scss']
})
export class CloseDownloadComponent implements OnInit {
  
  constructor(
    private _ticketService: TicketsService,
    private _snackBar: MatSnackBar
  ) { }
  @Input() stepperCloseDownload:any;
  imageUpload: any;
  layoutPdf: any;

  ngOnInit(): void {
    
  /*   let pngUrl = this._ticketService.getImage(this.stepperCloseDownload.evidence)
    this.imageUpload = pngUrl
    console.log(this.imageUpload); */
  }

  ngOnChanges(): void {
     setTimeout(() => {
      let pngUrl = this._ticketService.getImage(this.stepperCloseDownload.evidence)
      this.imageUpload = pngUrl
      console.log(this.imageUpload);
     }, ); 
  }

  generateDetailsPdf(){
    if(this.stepperCloseDownload.solutionReassig  !=undefined){
      this.layoutPdf = 'assets/docs/Tickets_reasignacion.pdf';
      this.generatePdfReassign(this.layoutPdf);
    }
    else{
      this.layoutPdf = 'assets/docs/Tickets_solucion.pdf';
      this.generatePdfSolution(this.layoutPdf);
    }
  }

  async generatePdfSolution(pdfDoc: any){
    let fileUrl = this._ticketService.getImage(this.stepperCloseDownload.evidence)
    const existingPdfBytes = await fetch(pdfDoc).then(res => res.arrayBuffer());
    const pdfDocByte = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDocByte.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const { width, height } = firstPage.getSize();
    const helveticaFont = await pdfDocByte.embedFont(StandardFonts.Helvetica);
    const dateAlert = this.transformDate(new Date(this.stepperCloseDownload.dateAlert));
    const dateRegistration = this.transformDate(new Date(this.stepperCloseDownload.ticketRegistrationDate));
    const dateSolution = this.transformDate(new Date(this.stepperCloseDownload.dateSolution));
    const durationAlert = this.stepperCloseDownload.alertDuration;
    const string = this.stepperCloseDownload.location;
    const length = 50;
    const location = string.substring(0, length);
    /*Detail Ticket*/
    firstPage.drawText(this.stepperCloseDownload.ticketID, {x: 339, y: 718, size: 17, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.titleTicket, {x: 160, y: 660, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.contract, {x: 125, y: 637, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.affectedPart, {x: 161, y: 614, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.host, {x: 100, y: 591, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.statusHost, {x: 161, y: 568, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.brand, {x: 110, y: 545, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.model, {x: 116, y: 522, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.serial, {x: 104, y: 499, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.statusTicket, {x: 168, y: 476, size: 12, font: helveticaFont});
    firstPage.drawText(dateRegistration, {x: 230, y: 453, size: 12, font: helveticaFont});
    firstPage.drawText(dateAlert, {x: 165, y: 430, size: 12, font: helveticaFont});
    firstPage.drawText(durationAlert, {x: 182, y: 407, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.userClient, {x: 113, y: 384, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.userEmail, {x: 171, y: 361, size: 12, font: helveticaFont});
    firstPage.drawText(location, {x: 133, y: 338, size: 12, font: helveticaFont});
    //Second page
    /*Support Response */
    firstPage.drawText(dateSolution, {x: 460 , y: 796, size: 12, font: helveticaFont });
    secondPage.drawText(dateSolution, {x: 460 , y: 796, size: 12, font: helveticaFont });
    secondPage.drawText(this.stepperCloseDownload.ticketID, {x: 339, y: 714, size: 17, font: helveticaFont});
    secondPage.drawText(this.stepperCloseDownload.solution, {x: 131, y: 645, size: 12, font: helveticaFont});
    secondPage.drawText(this.stepperCloseDownload.supportAssignment, {x: 146, y: 624, size: 12, font: helveticaFont});
    secondPage.drawText(dateSolution, {x: 177, y: 603, size: 12, font: helveticaFont});
    //secondPage.drawText(fileUrl, {x: 85, y: 250, size: 12, font: helveticaFont});
    secondPage.drawText(fileUrl, {x: 62, y: 545,size: 12, font: helveticaFont, color: rgb(0, 0.53, 0.71)});

    const pdfBytes = await pdfDocByte.save();
    try {
      this.savePdf(this.stepperCloseDownload.ticketID, pdfBytes);
      this.closeSnack();
    }catch(error){
      this.errorSnack();
    }

  }

  async generatePdfReassign(pdfDoc: any){
    console.log("Se toma el layout 2", pdfDoc);
    const existingPdfBytes = await fetch(pdfDoc).then(res => res.arrayBuffer());
    const pdfDocByte = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDocByte.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const thirdPage = pages [2];
    const { width, height } = firstPage.getSize();
    const helveticaFont = await pdfDocByte.embedFont(StandardFonts.Helvetica);
    const dateAlert = this.transformDate(new Date(this.stepperCloseDownload.dateAlert));
    const dateRegistration = this.transformDate(new Date(this.stepperCloseDownload.ticketRegistrationDate));
    const dateSolution = this.transformDate(new Date(this.stepperCloseDownload.dateSolution));
    const durationAlert = this.stepperCloseDownload.alertDuration;
    const dateSolutionReassig = this.transformDate(new Date(this.stepperCloseDownload.dateSolutionReassig));
    const string = this.stepperCloseDownload.location;
    const length = 50;
    const location = string.substring(0, length);
    let fileUrl = this._ticketService.getImage(this.stepperCloseDownload.evidence)
    let fileUrlReassigned = this._ticketService.getImage(this.stepperCloseDownload.evidenceReassig)
    /*Detail Ticket*/
    firstPage.drawText(this.stepperCloseDownload.ticketID, {x: 339, y: 718, size: 17, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.titleTicket, {x: 160, y: 660, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.contract, {x: 125, y: 637, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.affectedPart, {x: 161, y: 614, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.host, {x: 100, y: 591, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.statusHost, {x: 161, y: 568, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.brand, {x: 110, y: 545, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.model, {x: 116, y: 522, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.serial, {x: 104, y: 499, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.statusTicket, {x: 168, y: 476, size: 12, font: helveticaFont});
    firstPage.drawText(dateRegistration, {x: 230, y: 453, size: 12, font: helveticaFont});
    firstPage.drawText(dateAlert, {x: 165, y: 430, size: 12, font: helveticaFont});
    firstPage.drawText(durationAlert, {x: 182, y: 407, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.userClient, {x: 113, y: 384, size: 12, font: helveticaFont});
    //firstPage.drawText(this.stepperCloseDownload.userPhone, {x: 188, y: 361, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.userEmail, {x: 171, y: 361, size: 12, font: helveticaFont});
    firstPage.drawText(location, {x: 133, y: 338, size: 12, font: helveticaFont}); //338
    firstPage.drawText(dateSolution, {x: 460 , y: 796, size: 12, font: helveticaFont });
    //Second page
    /*Support Response */
    secondPage.drawText(dateSolution, {x: 460 , y: 796, size: 12, font: helveticaFont });
    secondPage.drawText(this.stepperCloseDownload.ticketID, {x: 339, y: 714, size: 17, font: helveticaFont});
    secondPage.drawText(this.stepperCloseDownload.solution, {x: 131, y: 645, size: 12, font: helveticaFont});
    secondPage.drawText(this.stepperCloseDownload.supportAssignment, {x: 146, y: 624, size: 12, font: helveticaFont});
    secondPage.drawText(dateSolution, {x: 177, y: 603, size: 12, font: helveticaFont});
    secondPage.drawText(fileUrl, {x: 62, y: 545,size: 12, font: helveticaFont, color: rgb(0, 0.53, 0.71)});
    /*Response Ressign*/
    thirdPage.drawText(dateSolutionReassig, {x: 460, y: 796, size: 12, font: helveticaFont });
    thirdPage.drawText(this.stepperCloseDownload.ticketID, {x: 339, y: 714, size: 17, font: helveticaFont});
    thirdPage.drawText(this.stepperCloseDownload.solutionReassig, {x: 131 , y: 645, size: 12, font: helveticaFont });
    thirdPage.drawText(this.stepperCloseDownload.responsableReassig, {x: 146 , y: 624, size: 12, font: helveticaFont });
    thirdPage.drawText(dateSolutionReassig, {x: 177, y: 603, size: 13, font: helveticaFont });
    thirdPage.drawText(fileUrlReassigned, {x: 62, y: 545, size: 12, font: helveticaFont, color: rgb(0, 0.53, 0.71)});

    const pdfBytes = await pdfDocByte.save();
    try {
      this.savePdf(this.stepperCloseDownload.ticketID, pdfBytes);
      this.closeSnack();
    }catch(error){
      this.errorSnack();
    }

  }

  savePdf(pdfName:any, byte:any){
    var blob = new Blob([byte], {type: "application/pdf"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = pdfName;
    link.download = fileName;
    link.click();
  }

  transformDate(date:any){
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    date = day + '/' + month + '/' + year;
    return date;
  }
  
  closeSnack(){
    this._snackBar.open('PDF descargado exitosamente', '',{
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack-info']
    });
  }

  errorSnack(){
    this._snackBar.open('PDF no generado', '',{
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack-red']
    });
  }

}
