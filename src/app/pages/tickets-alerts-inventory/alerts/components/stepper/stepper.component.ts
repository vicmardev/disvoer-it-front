import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { MatDialog } from '@angular/material/dialog';
import { AppproveTicketComponent } from 'src/app/pages/dialogs/ticket-alert/appprove-ticket/appprove-ticket.component';
import { ReassignTicketComponent } from 'src/app/pages/dialogs/ticket-alert/reassign-ticket/reassign-ticket.component';
import { CustomerSupportComponent } from '../../../customer-support/customer-support.component';
import { ClientInfoComponent } from './client-info/client-info.component';
import { FakeModalComponent } from 'src/app/pages/dialogs/fake-modal/fake-modal.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,

})


export class StepperComponent implements OnInit {
  @ViewChild('fileInput') el!: ElementRef;
  stepperParent: any;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  fileUpload!: string;
  imgUrl: any;
  removeUpload: boolean = false;
  editFile: boolean = true;
  evidenceURL = `${environment.apiUrl}/ticket-alert?filePath=`
  isDisabled:boolean = true; 
  titleTicket: string = '';
  dateCreation: any;
  phaseTicket: number = 0;
  statusPhase: boolean = false;
  isEditable: boolean = false;
  statusResponse = [
    /*
    { value: 'Canceled', name: 'Cancelado' },*/
    { value: 'Complete', name: 'Completo' },
  ]

  @Input() selectTicket: any;
  @ViewChild('stepper', { read: MatStepper }) stepper!: MatStepper;

  constructor(
    private _formBuilder: FormBuilder,
    private _serviceTicket: TicketsService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef

  ) { }
  responseSupport: FormGroup = this._formBuilder.group({
    solution: ['', Validators.required],
    statusTicket: ['', Validators.required],
    evidence: ['', Validators.required],
    stepTicket: [''],
    dateSolution: [''],
    ticketID: ['']
  });

  responseSupportReassign: FormGroup = this._formBuilder.group({
    solution: ['', Validators.required],
    solutionReassig: ['', Validators.required],
    statusTicket: ['', Validators.required],
    evidenceReassig: ['', Validators.required],
    stepTicket: [''],
    dateSolutionReassig: [''],
    dateSolution: [''],
    ticketID: ['']
  })



  ngOnInit() {

  }
  get spanishStatus() {
    switch (this.selectTicket.statusTicket) {
      case 'Complete':
        return "Completo"
        break;
      /*  
      case 'Canceled':
        return "Cancelado"
        break;*/

      case 'Reassigned':
        return "Reasignado"
        break;

      case 'Pending':
        return "En espera"
        break;


      default:
        return ' No conocido'
        break;
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.titleTicket = this.selectTicket.titleTicket;
      this.dateCreation = this.selectTicket.ticketRegistrationDate;
      this.phaseTicket = this.selectTicket.stepTicket;
      this.stepper.selectedIndex = this.phaseTicket - 1;
    });
  }

  onFileEvent(event: any) {
    const fileOne = event.target.files[0];
    if (fileOne) {
      this.isDisabled = false;
      if(fileOne.type == "application/pdf"){
        this.isDisabled = false
        console.log('Archivo con extension permitida');
        if(fileOne.size <= 2000000){
          this.isDisabled = false;
          console.log('Archivo con tamano permitido');
          const reader = new FileReader();
          reader.onload = () => {
            this.fileUpload = reader.result as string;
          };
          reader.readAsDataURL(fileOne);
          this.responseSupport.patchValue({ evidence: fileOne });
        }else{
          this.isDisabled = true;
          this._snackBar.open('El no debe ser mayor a 2MB', '', {
            duration: 3500,
              verticalPosition: 'top',
            panelClass: ['background-snack-info']
          });
        }
      }else{
        this.isDisabled = true;
        this._snackBar.open('Solo se permiten PDF', '', {
          duration: 3500,
            verticalPosition: 'top',
          panelClass: ['background-snack-info']
        });
      }      
    }else{
      this.responseSupport.value.evidence = '';
    }
  }

  onFileEventReassign(event: any) {
    const fileOne = event.target.files[0];
    if (fileOne) {
      this.isDisabled = false;
      if(fileOne.type == "application/pdf"){
        this.isDisabled = false
        console.log('Archivo con extension permitida');
        if(fileOne.size <= 2000000){
          this.isDisabled = false;
          console.log('Archivo con tamano permitido');
          const reader = new FileReader();
          reader.onload = () => {
            this.fileUpload = reader.result as string;
          };
          reader.readAsDataURL(fileOne);
          this.responseSupportReassign.patchValue({ evidenceReassig: fileOne });
        }else{
          this.isDisabled = true;
          this._snackBar.open('El no debe ser mayor a 2MB', '', {
            duration: 3500,
              verticalPosition: 'top',
            panelClass: ['background-snack-info']
          });
        }
      }else{
        this.isDisabled = true;
        this._snackBar.open('Solo se permiten PDF', '', {
          duration: 3500,
            verticalPosition: 'top',
          panelClass: ['background-snack-info']
        });
      }      
    }else{
      this.responseSupportReassign.value.evidence = '';
    }
  }

  /*
  onFileEventReassign(event: any) {
    const fileOne = event.target.files[0];
    if (fileOne) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fileUpload = reader.result as string;
      };
      reader.readAsDataURL(fileOne);
      this.responseSupportReassign.patchValue({ evidenceReassig: fileOne })
    }
    this._snackBar.open('El archivo no es permitido', '', {
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack-info']
    });
    //this.responseSupportReassign.value.evidence = '';
  }*/

  get form() {
    if (this.selectTicket.statusTicket != "Reassigned") return this.responseSupport.controls;
    else return this.responseSupportReassign.controls;
  }

  sendResponse() {
    this.setFormValues();
    if (this.selectTicket.statusTicket != "Reassigned") {
      this._serviceTicket.postResponseTicket(this.responseSupport.value, this.responseSupport.value.evidence).subscribe(res => {
        this.selectTicket.statusTicket = this.form.statusTicket.value;
        this._snackBar.open(`Actualizando ticket`, '',
          {
            duration: 3500,
        verticalPosition: 'top',
            panelClass: ['background-snack-info'],
          }
        );
        this.goToStep(5);
      })
    } else {
      this._serviceTicket.updateAlertTicket(this.selectTicket.id, this.responseSupportReassign.value, this.responseSupportReassign.value.solutionReassig).subscribe(res => {
        this.selectTicket.statusTicket = this.form.statusTicket.value;

        this._snackBar.open(`Actualizando ticket`, '',
          {
            duration: 3500,
        verticalPosition: 'top',
            panelClass: ['background-snack-info'],
          }
        );
        this.goToStepReasing(5);
      })
    }
  }

  setFormValues() {

    this.form.ticketID.setValue(this.selectTicket.ticketID);
    this.form.stepTicket.setValue(5);
    this.form.dateSolution.setValue(new Date());


    if (this.selectTicket.solution && this.selectTicket.statusTicket != "Reassigned") {
      this.form.statusTicket.setValue(this.selectTicket.statusTicket);
      this.responseSupport.get('solution')?.setValue(this.selectTicket.solution);
      this.responseSupport.disable();
    } else if (this.selectTicket.statusTicket != "Reassigned") {
      this.responseSupport.enable();
    }
    else if (this.selectTicket.statusTicket == "Reassigned") {
      this.form.dateSolutionReassig.setValue(new Date());
      this.form.solution.setValue(this.selectTicket.solution);
      this.form.dateSolution.setValue(this.selectTicket.dateSolution);
      if (this.selectTicket.solutionReassig && this.selectTicket.solutionReassig != "" && this.selectTicket.statusTicket != "Reassigned") {
        this.responseSupportReassign.get('solutionReassig')?.setValue(this.selectTicket.solutionReassig);
        this.responseSupportReassign.disable();
      } else {
        this.responseSupportReassign.enable();
      }

    }
  }

  OpenDialogAproveTicket(rowInfo: any) {
    const dialogRef = this.dialog.open(AppproveTicketComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      maxHeight: '90vh',
      data: {
        info: rowInfo,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.goToStep(result);

      this.openDialogStarRating(rowInfo)
    });

  }

  OpenDialogReassignTicket(rowInfo: any) {
    const dialogRef = this.dialog.open(ReassignTicketComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      maxHeight: '90vh',
      data: {
        info: rowInfo,
      },

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.goToStep(result);



    });
  }

  goToStep(step: number) {
    this.phaseTicket = step;
    this.selectTicket.stepTicket = step;
    this._serviceTicket.getTicketAlertById(this.selectTicket.id).subscribe((res: any) => {
      this.selectTicket.solution = res.solution;
      this.selectTicket.dateSolution = res.dateSolution;
      this.selectTicket.evidence = res.evidence;

    })
    this.stepper.selectedIndex = this.phaseTicket - 1;
    this.stepper.selectedIndex = step - 1;
  }
  goToStepReasing(step: number) {
    this.phaseTicket = step;
    this.selectTicket.stepTicket = step;
    this._serviceTicket.getTicketAlertById(this.selectTicket.id).subscribe((res: any) => {
      this.selectTicket.solution = res.solution;
      this.selectTicket.dateSolution = res.dateSolution;
      this.selectTicket.evidence = res.evidence;
      this.selectTicket.dateSolutionReassig = res.dateSolutionReassig;
      this.selectTicket.solutionReassig = res.solutionReassig;
      this.selectTicket.responsableReassig = res.responsableReassig;
      this.selectTicket.evidenceReassig = res.evidenceReassig;

    })

    this.stepper.selectedIndex = this.phaseTicket - 1;
    this.stepper.selectedIndex = step - 1;
  }

  openDialogStarRating(rowInfo: any) {
    const dialogRef = this.dialog.open(CustomerSupportComponent, {
      width: 'auto',
      height: 'auto',
      maxHeight: '90vh',
      data: {
        info: rowInfo
      }
    });

    dialogRef.afterClosed();
  }



  openDialog() {
    const dialogRef = this.dialog.open(FakeModalComponent, {
        width: 'auto',
        height: 'auto',
        autoFocus: false,
        maxHeight: '90vh',
    })

    dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
    });
}


}
