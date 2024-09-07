import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { Router } from '@angular/router';


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
@Component({
  selector: 'app-create-ticket-inventory',
  templateUrl: './create-ticket-inventory.component.html',
  styleUrls: ['./create-ticket-inventory.component.scss']
})
export class CreateTicketInventoryComponent implements OnInit {


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
  suportListIt: Support[] = [
    { value: '-- --', viewValue: '-- --' },
    { value: 'Jose Luis Xolo', viewValue: 'Jose Luis  Xolo Pelayo' },
    { value: 'Juan Mejia', viewValue: 'Juan Mejia Castro' },
    { value: 'Alejandro Sánchez', viewValue: 'Alejandro Sánchez' },
  ];
  suportListIp: Support[] = [
    { value: '-- --', viewValue: '-- --' },
    { value: 'Luis Sanabria', viewValue: 'Luis Sanabria' },
    { value: 'Angel Leon', viewValue: 'Angel Leon' },
  ];
  selectedSeverity: any = '-- --';
  selectedIssue: any = '-- --';
  selectedClient: any = '-- --';
  selectedSuport: any = '-- --';

  public formMakeTicket = this._formBuilder.group({
    Contrato:['',[Validators.required]],
    clientName:['',[Validators.required]],
    equipment: ['', [Validators.required]],
    model: ['', [Validators.required]],
    title: ['', [Validators.required]],
    userName: ['', [Validators.required]],
    email: ['', [Validators.required]],
    description: ['', [Validators.required]],
    severity: [this.selectedSeverity, [Validators.required]],
    issueType: [this.selectedIssue, [Validators.required]],
    client: [this.selectedClient, [Validators.required]],
    assignedSupportOperator: [this.selectedSuport, [Validators.required]],
    contract: ['', [Validators.required]],
    telephone: ['', [Validators.required]],
    equipmentSerial: ['', [Validators.required]],
    fileUpload: [''],
    adressEquipmet:['',[Validators.required]],
    brand:['',[Validators.required]],
    noSerie:['',[Validators.required]],
    affectationPart:['',[Validators.required]],
    operatingSystem:['',[Validators.required]]
  });

  idContrato: any;
  constructor(
    @Inject(
      MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    private _invetaryService: InventoryService,
    private _snackBar: MatSnackBar,
    private _ticketServices: TicketsService,
    private _router:Router
  ) {   }

  ngOnInit(): void {
    this.idContrato = this.data.info;
    this.getvaluesForm();
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formMakeTicket.patchValue({
        fileUpload: file
      });
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
  closeSnack() {
    this._snackBar.open('Ticket Creado con Exito.', '', {
      duration: 3500,
      verticalPosition: 'top',
      /* horizontalPosition: 'center', */
      panelClass: ['background-snack'],
      /*  horizontalPosition: 'start',
      verticalPosition: 'top', */
    });
    this.invetoryTickets();
  }

  craeteNewTicket() {
    this._ticketServices.createInventoryTicket(this.formMakeTicket.value).subscribe(res => {
      if (res) {
        this.closeDialog();
        this.closeSnack();
        
      } else {
        this.errorSnack();
      }
    })
  }

  invetoryTickets(){
    this._router.navigateByUrl('dash/ticketsAlerts/inventoryTickets');
  }

  errorSnack() {
    this._snackBar.open('Error al crear Ticket comunicate  con el  admin', '', {
      duration: 3500,
      verticalPosition: 'top',
      /* horizontalPosition: 'center', */
      panelClass: ['background-snack'],
    });
  }
  getvaluesForm() {
    this.formMakeTicket.controls['equipment'].setValue(this.data.info.Equipment);
    this.formMakeTicket.controls['model'].setValue(this.data.info.Model);
    this.formMakeTicket.controls['contract'].setValue(this.data.info.Contrato);
    this.formMakeTicket.controls['equipmentSerial'].setValue(this.data.info.Serial);
    this.formMakeTicket.controls['Contrato'].setValue(this.data.info.Contrato);
    this.formMakeTicket.controls['brand'].setValue(this.data.info.Brand);
    this.formMakeTicket.controls['noSerie'].setValue(this.data.info.Serial);
  }
}
