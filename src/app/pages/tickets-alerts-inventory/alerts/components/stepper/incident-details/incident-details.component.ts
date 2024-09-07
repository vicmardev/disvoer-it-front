import { Component, OnInit, Input,SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FakeModalComponent } from 'src/app/pages/dialogs/fake-modal/fake-modal.component';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { ClientInfoComponent } from '../client-info/client-info.component';
import { ClientResObsComponent } from '../client-res-obs/client-res-obs.component';
import { ModalComponent } from './modal/modal.component';
import { FakeModal2Component } from 'src/app/pages/dialogs/fake-modal/fake-modal2/fake-modal2.component';

@Component({
  selector: 'app-incident-details',
  templateUrl: './incident-details.component.html',
  styleUrls: ['./incident-details.component.scss']
})
export class IncidentDetailsComponent implements OnInit {

  contract: string = '';
  host: string = '' ;
  affectedPart: any;
  statusHost: string = '';
  alertDuration: any;
  location: string = '';
  titleTicket: string = '';
  response: string = '';
  dateAlert:  any;
  supportAssignment: any;
  userPhone: any;
  phaseTicket:number=0;


  @Input() incidentDetails: any;
  @ViewChild('stepper',{read:MatStepper}) stepper!:MatStepper;

  constructor(public dialog: MatDialog, 
    private _ticketService: TicketsService,
    ) { }
  
  openDialog(){
    let dialogRef = this.dialog.open(ModalComponent,  {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      maxHeight: '90vh',
      data: this.incidentDetails,
    });
    dialogRef.afterClosed().subscribe(result=>{
      this._ticketService.getTicketAlertById(this.incidentDetails.id).subscribe(res =>{
        this.incidentDetails = res;
        console.log( 'update',this.incidentDetails);
        
        this.updateDetails();
      })
    })
    this._ticketService.getTicketAlertById;
    this._ticketService.getAllAlarms;
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

    setTimeout(() => {
      this.updateDetails();
      this.phaseTicket =  this.incidentDetails.stepTicket;
      this.stepper.selectedIndex = this.phaseTicket-1;
      
    }, );
  }

  updateDetails(){
    this.contract = this.incidentDetails.contract ? this.incidentDetails.contract : this.incidentDetails.contrato;
    this.host = this.incidentDetails.host;
    this.affectedPart = this.incidentDetails.affectedPart;
    this.statusHost = this.incidentDetails.statusHost;
    this.alertDuration = this.incidentDetails.alertDuration;
    this.location = this.incidentDetails.location;
    this.titleTicket = this.incidentDetails.titleTicket;
    this.response = this.incidentDetails.response;
    this.dateAlert = this.incidentDetails.dateAlert;
    this.supportAssignment = this.incidentDetails.supportAssignment;
    this.userPhone = this.incidentDetails.userPhone;
  }

  openDialogInfo(){
    const dialogRef = this.dialog.open(ClientInfoComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      maxHeight: '90vh',
      data: {
        info: this.incidentDetails,
      },
  })
  
  dialogRef.afterClosed().subscribe(result => {
    this._ticketService.getTicketAlertById( this.incidentDetails.ticketID).subscribe((res:any)=>{
      this.incidentDetails  =  res;
      window.location.reload()
      
    })
   console.log('cerrando el  dialogo', this.incidentDetails);
 //  this.goToStep(2);
   
  });

}

  openDialogResponseClient() {
    const dialogRef = this.dialog.open(ClientResObsComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      maxHeight: '90vh',
      data: {
        info: this.incidentDetails,
      },
    })
   
    dialogRef.afterClosed().subscribe(result => {
      this._ticketService.getTicketAlertById(this.incidentDetails.ticketID).subscribe((res: any) => {
        this.incidentDetails = res;
        window.location.reload()
      })
    // this.goToStep(3);
    
    });
  }
  goToStep(step: number){
    this.phaseTicket = step;
    this.incidentDetails.stepTicket = step;
    this._ticketService.getTicketAlertById(this.incidentDetails.id).subscribe((res:any)=>{

    })  
    this.stepper.selectedIndex = this.phaseTicket-1;    
    this.stepper.selectedIndex = step-1;
  }




   /* Fake modal */
   openDialogFake() {
    const dialogRef = this.dialog.open(FakeModalComponent, {
        width: 'auto',
        height: 'auto',
        autoFocus: false,
        maxHeight: '90vh',
    })

    dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.openDialog2(result);
    });
}
openDialog2(rowInfo: any) {
    const dialogRef = this.dialog.open(FakeModal2Component, {
        width: 'auto',
        height: 'auto',
        maxHeight: '90vh',
        data: {
            info: rowInfo
        }
    });

    dialogRef.afterClosed();
}




}
