import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-client-res-obs',
  templateUrl: './client-res-obs.component.html',
  styleUrls: ['./client-res-obs.component.scss']
})
export class ClientResObsComponent implements OnInit {

  ticketInfo:any;
  formResponse = this._formBuilder.group({
    ObservationResponseUser: ['',[Validators.required]],
})
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public  _formBuilder:FormBuilder,
    private dialogRef: MatDialogRef<any>,
    private _ticketsAlerts:TicketsService,
    private _snackBar:MatSnackBar
    
  ) { }

  ngOnInit(): void {
    console.log('data response ', this.data.info);
  }
  closeDialog(){
    this.dialogRef.close();
  }
  saveResponse(){
    this.ticketInfo =   this.data.info;
    console.log('save',this.ticketInfo);
      this.ticketInfo.ObservationResponseUser = this.formResponse.get('ObservationResponseUser')?.value;
    
    this._ticketsAlerts.postQuestions( this.ticketInfo).subscribe(res=>{
      if (res) {
        window.location.reload()
        this._snackBar.open(`Información enviada`, '',
        {
          duration: 3500,
        verticalPosition: 'top',
          panelClass: ['background-snack-info'],
        }
      ); 
      }
    })
  
    this.dialogRef.close();
  }
}
