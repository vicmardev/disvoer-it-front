import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';

@Component({
  selector: 'app-appprove-ticket',
  templateUrl: './appprove-ticket.component.html',
  styleUrls: ['./appprove-ticket.component.scss']
})
export class AppproveTicketComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _ticketServices: TicketsService
  ) {}

  fileUpload: FormGroup = this._formBuilder.group({
    pdfFile: ['', Validators.required]
  });

  imageUpload: any;
  layoutPdf: any;
  pdfDoc: any;

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    setTimeout(() => {
      let pngUrl = this._ticketServices.getImage(this.data.info.evidence);
      this.imageUpload = pngUrl;
      console.log(this.imageUpload);
    }, );    
  }

  

  approveTicket(){
    let approvedTicket = this.data.info;
    approvedTicket.stepTicket = 6;
    if (this.data.type == "inventory"){
      approvedTicket.status = "Complete"

      this._ticketServices.updateInventoryTicket(approvedTicket.id, approvedTicket).pipe(first()).subscribe( res =>
        {
          if (res) {
            this.closeDialog();
            this.closeSnack();
            this.generateDetailPdf();
          } else {
            this.errorSnack();
          }
        }
      )
    }
    else {
      console.log(approvedTicket);
      approvedTicket.statusTicket = "Complete"
      this._ticketServices.updateTicket(approvedTicket.id, approvedTicket).pipe(first()).subscribe( res =>
        {
          if (res) {
            this.closeDialog();
            this.closeSnack();
            this.generateDetailPdf();
          } else {
            this.errorSnack();
          }
        }
      )
    }
  }

  generateDetailPdf(){
    if(this.data.info.solutionReassig !=undefined){
      this.layoutPdf = 'assets/docs/Tickets_reasignacion.pdf';
      this.generatePdfReassign(this.layoutPdf);
    }
    else {
      this.layoutPdf = 'assets/docs/Tickets_solucion.pdf';
      this.generatePdfSolution(this.layoutPdf);
    }
  }

  async generatePdfSolution(pdfDoc: any){
    console.log('Es solucion normal');
    let fileUrl = this._ticketServices.getImage(this.data.info.evidence)
    const existingPdfBytes = await fetch(pdfDoc).then(res => res.arrayBuffer());
    const pdfDocByte = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDocByte.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const { width, height } = firstPage.getSize();
    const helveticaFont = await pdfDocByte.embedFont(StandardFonts.Helvetica);
    const dateAlert = this.transformDate(new Date(this.data.info.dateAlert));
    const dateRegistration = this.transformDate(new Date(this.data.info.ticketRegistrationDate));
    const dateSolution = this.transformDate(new Date(this.data.info.dateSolution));
    const durationAlert = this.data.info.alertDuration;
    const string = this.data.info.location;
    const length = 50;
    const location = string.substring(0, length);
    /*Detail Ticket*/
    firstPage.drawText(this.data.info.ticketID, {x: 339, y: 718, size: 17, font: helveticaFont});
    firstPage.drawText(this.data.info.titleTicket, {x: 160, y: 660, size: 12, font: helveticaFont});
    firstPage.drawText(this.data.info.contract, {x: 125, y: 637, size: 12, font: helveticaFont});
    firstPage.drawText(this.data.info.affectedPart, {x: 161, y: 614, size: 12, font: helveticaFont});
    firstPage.drawText(this.data.info.host, {x: 100, y: 591, size: 12, font: helveticaFont});
    firstPage.drawText(this.data.info.statusHost, {x: 161, y: 568, size: 12, font: helveticaFont});
    firstPage.drawText(this.data.info.brand, {x: 110, y: 545, size: 12, font: helveticaFont});
    firstPage.drawText(this.data.info.model, {x: 116, y: 522, size: 12, font: helveticaFont});
    firstPage.drawText(this.data.info.serial, {x: 104, y: 499, size: 12, font: helveticaFont});
    firstPage.drawText(this.data.info.statusTicket, {x: 168, y: 476, size: 12, font: helveticaFont});
    firstPage.drawText(dateRegistration, {x: 230, y: 453, size: 12, font: helveticaFont});
    firstPage.drawText(dateAlert, {x: 165, y: 430, size: 12, font: helveticaFont});
    firstPage.drawText(durationAlert, {x: 182, y: 407, size: 12, font: helveticaFont});
    firstPage.drawText(this.data.info.userClient, {x: 113, y: 384, size: 12, font: helveticaFont});
    firstPage.drawText(this.data.info.userEmail, {x: 171, y: 361, size: 12, font: helveticaFont});
    firstPage.drawText(location, {x: 133, y: 338, size: 12, font: helveticaFont});
    //Second page
    /*Support Response */
    firstPage.drawText(dateSolution, {x: 460 , y: 796, size: 12, font: helveticaFont });
    secondPage.drawText(dateSolution, {x: 460 , y: 796, size: 12, font: helveticaFont });
    secondPage.drawText(this.data.info.ticketID, {x: 339, y: 714, size: 17, font: helveticaFont});
    secondPage.drawText(this.data.info.solution, {x: 131, y: 645, size: 12, font: helveticaFont});
    secondPage.drawText(this.data.info.supportAssignment, {x: 146, y: 624, size: 12, font: helveticaFont});
    secondPage.drawText(dateSolution, {x: 177, y: 603, size: 12, font: helveticaFont});
    //secondPage.drawText(fileUrl, {x: 85, y: 250, size: 12, font: helveticaFont});
    secondPage.drawText(fileUrl, {x: 62, y: 545,size: 12, font: helveticaFont, color: rgb(0, 0.53, 0.71)});
    
    console.log('El valor de pdfBytes', pdfDocByte);
    //const reader = new FileReader();
    //var blob = new Blob([pdfDocByte], {type: "application/pdf"});
    //reader.readAsDataURL(blob);
    

    const pdfBytes = await pdfDocByte.save();
    try {
      this.savePdf(this.data.info.ticketID, pdfBytes);
      this.closeSnack();
    }catch(error){
      this.errorSnack();
    }

  }

  async generatePdfReassign(pdfDoc: any){
    console.log('Es reasignacion');
  }

  transformDate(date:any){
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    date = day + '/' + month + '/' + year;
    return date;
  }

  savePdf(pdfName:any, byte:any){

    console.log('El valor de byte en savePDF', byte)
    var blob = new Blob([byte], {type: "application/pdf"});
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    console.log('El valor de blob: ', blob);
    
    this.fileUpload.patchValue({ pdfFile: blob });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    this._ticketServices.updateTicketFile(this.data.info.id, blob).pipe(first()).subscribe(res =>{
      if(res){
        this.closeDialog();
        this.closeSnack();
      }else{
        this.errorSnack();
      }
    })
    console.log('Valor de link.href:', link);
    var fileName = pdfName;
    link.download = fileName;

    link.click();
  }

  closeDialog(){
    //returns 6 to go to step 6, meaning ticket is approved
    this.dialogRef.close(6);
  }

  closeSnack() {
    const msg = 'Ticket Actualizado con Exito.';
    this._snackBar.open(msg, '', {
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack'],
      /*  horizontalPosition: 'start',
      verticalPosition: 'top', */
    });
  }

  errorSnack() {
    this._snackBar.open('Error al modificar el ticket, intentalo de nuevo o comunicate  con tu administrador', '', {
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack'],
    });
  }





}
