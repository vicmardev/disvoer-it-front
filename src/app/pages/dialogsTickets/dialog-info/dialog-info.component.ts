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
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss']
})
export class DialogInfoComponent implements OnInit {

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
    {value: 'Pending', viewValue: 'Pending'}
  ]



  public ticketResponse = this._formBuilder.group({
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
    clientEvidencePath: [this.data.info.clientEvidencePath],
    assignedSupportOperator: [this.data.info.assignedSupportOperator, [Validators.required]],
    status: [this.data.info.status, [Validators.required]],
    responseComments: [this.data.info.responseComments ? this.data.info.responseComments: '' ],
    responseDate: [this.data.info.responseDate],
    reassignToOperator:['-- --'], 
    escalateToOperator:['-- --'],
    responseEscalateTo:[this.data.info.responseEscalateTo ? this.data.info.responseEscalateTo: '']
  });

  dataString = JSON.stringify(this.data);
  id  = this.data.info.id;
  ticketName = this.data.info.ticketID;
  
  constructor(
    @Inject(
      MAT_DIALOG_DATA) public data:any,
      private dialogRef: MatDialogRef<any>,
      private _formBuilder: FormBuilder,
      private _ticketService: TicketsService,
      private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log(this.data.info);
    this.setValuesForm();
    
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setValuesForm(){
    if (this.data.info.reassignToOperator)
      this.ticketResponse.controls['reassignToOperator'].setValue(this.data.info.reassignToOperator);
    if(this.data.info.escalateToOperator)
      this.ticketResponse.controls['escalateToOperator'].setValue(this.data.info.escalateToOperator);
    if(!this.data.info.responseComments)
      this.ticketResponse.controls['responseComments'].setValue('');
    if(!this.data.info.responseEscalateTo)
      this.ticketResponse.controls['responseEscalateTo'].setValue('');

  }
}
