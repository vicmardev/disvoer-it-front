import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import { User } from 'src/app/models/User';
import { AccountService } from 'src/app/services/account/account.service';


@Component({
  selector: 'app-info-row-inventory',
  templateUrl: './info-row-inventory.component.html',
  styleUrls: ['./info-row-inventory.component.scss']
})
export class InfoRowInventoryComponent implements OnInit {

  user!: User;

  public formEditRow = this._formBuilder.group({
    Serial: ['', [Validators.required]],
    SerialOctopian: ['', Validators.required],
    Contrato: ['', [Validators.required]],
    Model: ['', [Validators.required]],
    Status: ['', Validators.required],
    Brand: ['', [Validators.required]],
    Equipment: ['', [Validators.required]],
    HardwareProvider: [Validators.required],
    SLA: ['', [Validators.required]],
    ServiceTag: ['', Validators.required],
    City: ['', [Validators.required]],
    Address: ['', [Validators.required]],
    Start: ['', [Validators.required]],
    End: ['', [Validators.required]],
    id: ['', [Validators.required]],
    ContractEnded: ['']
  })

  idContrato: any;
  constructor(
    @Inject(
      MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    private _invetaryService: InventoryService,
    private accountService: AccountService,
    private _snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.user = this.accountService.userValue;

    this.idContrato = this.data.info;
    this.getvaluesForm();
  }
  closeDialog() {
    this.dialogRef.close();
  }

  updateRow() {
    let id = this.data.info.id;
    this._invetaryService.updateRowId(id, this.formEditRow.value).subscribe(res => {

    })
    this.closeSnack();
    this.dialogRef.close();
  }

  getvaluesForm() {
    /*  this.formEditRow.controls['Contrato'].disabled();
    this.formEditRow.controls['SLA'].disabled(); */
    //
    this.formEditRow.controls['Serial'].setValue(this.data.info.Serial);
    this.formEditRow.controls['SerialOctopian'].setValue(this.data.info.SerialOctopian);
    this.formEditRow.controls['Contrato'].setValue(this.data.info.Contrato);
    this.formEditRow.controls['Model'].setValue(this.data.info.Model);
    this.formEditRow.controls['Status'].setValue(this.data.info.Status);
    this.formEditRow.controls['Brand'].setValue(this.data.info.Brand);
    this.formEditRow.controls['Equipment'].setValue(this.data.info.Equipment);
    this.formEditRow.controls['HardwareProvider'].setValue(this.data.info.HardwareProvider);
    this.formEditRow.controls['SLA'].setValue(this.data.info.SLA);
    this.formEditRow.controls['ServiceTag'].setValue(this.data.info.ServiceTag);
    this.formEditRow.controls['City'].setValue(this.data.info.City);
    this.formEditRow.controls['Address'].setValue(this.data.info.Address);
    this.formEditRow.controls['End'].setValue(this.data.info.End);
    this.formEditRow.controls['Start'].setValue(this.data.info.Start);
    this.formEditRow.controls['ContractEnded'].setValue('');

    this.formEditRow.disable();

    //
    /*  this.formEditRow.controls['Contrato'].disable();
    this.formEditRow.controls['SLA'].disable(); */
  }


  closeSnack() {
    this._snackBar.open('Actualización de datos exitosa.', '', {
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack'],
      /*  horizontalPosition: 'start',
      verticalPosition: 'top', */
    });

  }

}
