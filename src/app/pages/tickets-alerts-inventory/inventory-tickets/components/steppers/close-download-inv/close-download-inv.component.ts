import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-close-download-inv',
  templateUrl: './close-download-inv.component.html',
  styleUrls: ['./close-download-inv.component.scss']
})
export class CloseDownloadInvComponent implements OnInit {

  constructor(
    private _snackBar: MatSnackBar
  ) { }
  @Input() stepperCloseDownload:any;


  ngOnInit(): void {
  }

  async generateDetailPdf(){
    const formUrl = 'assets/docs/Tickets_Details.pdf';
    const existingPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const dateCreated = this.transformDate(new Date(this.stepperCloseDownload.created));
    const dateSolution = this.transformDate(new Date(this.stepperCloseDownload.responseDate));

    const string = this.stepperCloseDownload.adressEquipmet;
    const length = 50;
    const location = string.substring(0, length);

    /*Detail Ticket*/
    firstPage.drawText(this.stepperCloseDownload.ticketID, {x: 339, y: 714, size: 17, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.title, {x: 160, y: 660, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.contract, {x: 125, y: 637, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.affectationPart, {x: 161, y: 614, size: 12, font: helveticaFont});
    //firstPage.drawText(this.stepperCloseDownload.host, {x: 100, y: 591, size: 12, font: helveticaFont});
    //firstPage.drawText(this.stepperCloseDownload.statusHost, {x: 161, y: 568, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.brand, {x: 110, y: 545, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.model, {x: 116, y: 522, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.equipmentSerial, {x: 104, y: 499, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.status, {x: 168, y: 476, size: 12, font: helveticaFont});
    firstPage.drawText(dateCreated, {x: 230, y: 453, size: 12, font: helveticaFont});
    //firstPage.drawText(dateAlert, {x: 165, y: 430, size: 12, font: helveticaFont});
    //firstPage.drawText(durationAlert, {x: 182, y: 407, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.clientName, {x: 113, y: 384, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.telephone, {x: 188, y: 361, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.email, {x: 171, y: 338, size: 12, font: helveticaFont});
    firstPage.drawText(location, {x: 133, y: 316, size: 12, font: helveticaFont});
    /*Support Response */
    firstPage.drawText(this.stepperCloseDownload.responseComments, {x: 133, y: 263, size: 12, font: helveticaFont});
    firstPage.drawText(this.stepperCloseDownload.assignedSupportOperator, {x: 147, y: 242, size: 12, font: helveticaFont});
    firstPage.drawText(dateSolution, {x: 179, y: 222, size: 12, font: helveticaFont});
    /*Response Ressign */
    if(this.stepperCloseDownload.responsableReassig && this.stepperCloseDownload.responsableReassig !=""){
      firstPage.drawText('Solución de soporte (Reasignación)',{x: 55 , y: 190, size: 16, font: helveticaFont, color: rgb(0.95, 0.1, 0.1)});
      firstPage.drawText('Respuesta: ' + this.stepperCloseDownload.solutionReassig, {x: 68 , y: 165, size: 13.5, font: helveticaFont });
      firstPage.drawText('Responsable: ' + this.stepperCloseDownload.responsableReassig, {x: 68 , y: 145, size: 13.5, font: helveticaFont });
      //firstPage.drawText('Fecha de solución: ' + dateSolutionReassig, {x: 68, y: 125, size: 13.5, font: helveticaFont });
    }

    /*Close date ticket */
    if(this.stepperCloseDownload.responsableReassig && this.stepperCloseDownload.responsableReassig !="" ){
      //firstPage.drawText(dateSolutionReassig, {x: 460 , y: 796, size: 12, font: helveticaFont });
    }
    else{
      firstPage.drawText(dateSolution, {x: 460 , y: 796, size: 12, font: helveticaFont });
    }
    
    const pdfBytes = await pdfDoc.save();
    try{
      this.savePdf(this.stepperCloseDownload.ticketID, pdfBytes);
      this.closeSnack();

    }
    catch(error){
      this.errorSnack();
    }
  }

  savePdf(pdfName: any, byte: any){
    var blob = new Blob([byte], {type: "application/pdf"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = pdfName;
    link.download = fileName;
    link.click();
  }

  transformDate(date: any){
    const day= date.getDate();
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
