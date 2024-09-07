import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeriesNatrOptions } from 'highcharts';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss']
})
export class ClientInfoComponent implements OnInit {

   formObservations = this._formBuilder.group({
    ObservationSupport: ['se  debe mandar  el  modelo, marca  y numero de  serie ',[Validators.required]],
})
ticketInfo:any;
  
  constructor(

    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    public _formBuilder:FormBuilder,
    public _ticketsAlerts: TicketsService,
    public _snackBar:MatSnackBar
  ) {

    
   }

  ngOnInit(): void {
    console.log(this.data);
    
  }
  saveObs(){
    this.ticketInfo =   this.data.info;
    console.log('save',this.ticketInfo);
      this.ticketInfo.ObservationSupport = this.formObservations.get('ObservationSupport')?.value;
    
    this._ticketsAlerts.postQuestions( this.ticketInfo).subscribe(res=>{
      if (res) {
        this._snackBar.open(`Información enviada`, '',
        {
          duration: 3500,
        verticalPosition: 'top',
          panelClass: ['background-snack-info'],
        }
      ); 
      }
    })
    console.log(this.formObservations.value);
    this.dialogRef.close();

  }
  closeDialog(){
    this.dialogRef.close();
  }

  

  



}
