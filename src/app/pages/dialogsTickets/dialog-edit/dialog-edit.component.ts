import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
interface Severidad {
  value: string;
  viewValue: string;
}
interface Issue {
  value: string;
  viewValue: string;
}
interface Client {
  value: string;
  viewValue: string;
}
interface Support {
  value: string;
  viewValue: string;
}
interface List {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['./dialog-edit.component.scss']
})
export class DialogEditComponent implements OnInit {

  severidad: Severidad[] = [
    { value: '-- --', viewValue: '-- --' },
    { value: 'Baja', viewValue: 'Baja' },
    { value: 'Media', viewValue: 'Media' },
    { value: 'Alta', viewValue: 'Alta' },
  ];
  listIssue: Issue[] = [
    { value: '-- --', viewValue: '-- --' },
    { value: 'Hardware', viewValue: 'Hardware' },
    { value: 'Software', viewValue: 'Software' },
  ];
  clientList: Issue[] = [
    { value: '-- --', viewValue: '-- --' },
    { value: 'Hp', viewValue: 'Hp' },
  ];
  suportList: Support[] = [
    { value: '-- --', viewValue: '-- --' },
    { value: 'Soporte 1', viewValue: 'Soporte 1' },
    { value: 'Soporte 2', viewValue: 'Soporte 2' },
    { value: 'Soporte 3', viewValue: 'Soporte 3' },
  ];

  statusList: List[] = [
    {value: 'Pending', viewValue: 'Pending'},
    {value: 'Complete', viewValue: 'Complete'},
    {value: 'Canceled', viewValue: 'Canceled'},
  ];

  suportListIt: Support[] = [
    {value: '-- --', viewValue: '-- --'},
    {value: 'Jose Luis Xolo', viewValue: 'Jose Luis Xolo'},
    {value: 'Juan Mejia', viewValue: 'Juan Mejia'},
    {value: 'Alejandro Sanchez', viewValue: 'Alejandro Sanchez'},
  ];

  suportListIp: Support[] =[
    {value: '-- --', viewValue: '-- --'},
    {value: 'Luis Sanabria', viewValue: 'Luis Sanabria'},
    {value: 'Angel Leon', viewValue:'Angel Leon'}
  ];

  selectedSuport: any = '-- --';

  public ticketResponse = this._formBuilder.group({
    ticketID: [this.data.info.ticketID, [Validators.required]],
    equipment: [this.data.info.equipment, [Validators.required]],
    model: [this.data.info.model, [Validators.required]],
    title: [this.data.info.title, [Validators.required]],
    description: [this.data.info.description, [Validators.required]],
    severity: [this.data.info.severity, [Validators.required]],
    client: [this.data.info.client, [Validators.required]],
    issueType: [this.data.info.issueType, [Validators.required]],
    userName: [this.data.info.userName, [Validators.required]],
    contract: [this.data.info.contract, [Validators.required]],
    email: [this.data.info.email, [Validators.required]],
    telephone: [this.data.info.telephone, [Validators.required]],
    equipmentSerial: [this.data.info.equipmentSerial, [Validators.required]],
    clientEvidencePath: [this.data.info.clientEvidencePath ? this.data.info.clientEvidencePath : ''],
    assignedSupportOperator: [this.data.info.assignedSupportOperator, [Validators.required]],
    status: [this.data.info.status, [Validators.required]],
    responseComments: [this.data.info.responseComments ? this.data.info.responseComments: '' ],
    responseDate: [new Date().toISOString()],
    responseTime: [''],
    closeDate: [''],
    fileUpload: [''],
    reassignToOperator:['-- --' /*,[Validators.required]*/],
    escalateToOperator:['-- --'],
    responseEscalateTo:[this.data.info.responseEscalateTo ? this.data.info.responseEscalateTo: '']
  });
  
  
  

  dataString = JSON.stringify(this.data);
  id  = this.data.info.id;
  ticketName = this.data.info.ticketID;
  reassignToOperatorData = this.data.info.reassignToOperator;
  
  responseTime: any;
  tableInfo: any;
  dataSource: any;

  
  constructor(
    @Inject(
      MAT_DIALOG_DATA) public data:any,
      private dialogRef: MatDialogRef<any>,
      private _formBuilder: FormBuilder,
      private _ticketService: TicketsService,
      private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log(this.data.info);
    console.log(this.reassignToOperatorData);
    
    //this.ticketResponse.controls['reassignToOperator'].setValue('');
    if (this.data.info.closeDate){
      let end = Date.parse(this.data.info.closeDate);
      let start = Date.parse(this.data.info.created); 
      
      
      this.responseTime = this.duration(start, end);
      
    }else{
      this.responseTime = '';
    }
    this.setValuesForm();
    
  }

  setValuesForm(){
    this.ticketResponse.controls['responseTime']. setValue(this.responseTime)
    if (this.data.info.reassignToOperator)
      this.ticketResponse.controls['reassignToOperator'].setValue(this.data.info.reassignToOperator);
    if(this.data.info.escalateToOperator)
      this.ticketResponse.controls['escalateToOperator'].setValue(this.data.info.escalateToOperator);
    if(!this.data.info.responseComments)
      this.ticketResponse.controls['responseComments'].setValue('');
    if(!this.data.info.responseEscalateTo)
      this.ticketResponse.controls['responseEscalateTo'].setValue('');

  }

  updateTicket() {
    
    this.ticketResponse.removeControl('closeDate');
    console.log("El valor del arreglo ticketResponse: ",this.ticketResponse.value);
    
    this._ticketService.updateInventoryTicket(this.id,this.ticketResponse.value).subscribe(res => {
      if (res) {
        this.closeDialog();
        this.closeSnack();
      } else {
        this.errorSnack();
      }
    })
  }

  closeTicket() {
    this.ticketResponse.controls['closeDate'].setValue(new Date().toISOString());

    
    this._ticketService.updateInventoryTicket(this.id,this.ticketResponse.value).subscribe(res => {
      if (res) {
        this.closeDialog();
        this.closeSnack();
      } else {
        this.errorSnack();
      }
    })
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.ticketResponse.patchValue({
        fileUpload: file
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  closeSnack() {
    this._snackBar.open('Ticket Modificado con Exito.', '', {
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack'],
      /*  horizontalPosition: 'start',
      verticalPosition: 'top', */
    });
  }

  errorSnack() {
    this._snackBar.open('Error al modificar Ticket', '', {
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack'],
    });
  }

  duration(start: number, end: number) {
    //amount of secinds in a day
    const dayLength = 86400;
    //amount of seconds in hour
    const hourLength = 3600;
    let timeDifference = end / 1000 - start / 1000;
    let days = Math.floor(timeDifference / dayLength);
    let hours = Math.floor((timeDifference % dayLength) / hourLength);
    let minutes = Math.floor(((timeDifference % dayLength) % hourLength) / 60);
    let seconds = Math.floor(timeDifference % 60);
    return (
      `${days}d ${hours}h ${minutes}m ${seconds}s`
    );
  }

}
