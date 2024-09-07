import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartsWerehouseService } from 'src/app/services/partsWerehouse/parts-werehouse.service';
@Component({
  selector: 'app-add-edit-part',
  templateUrl: './add-edit-part.component.html',
  styleUrls: ['./add-edit-part.component.scss']
})
export class AddEditPartComponent implements OnInit {
  public formCreatePart = this._formBuilder.group({
    type: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    serialNumber: ['', Validators.required],
    partNumber: ['', Validators.required],
    capacity: ['', Validators.required],
    contract: ['', Validators.required],
    status: ['', Validators.required],
    supplier: ['', Validators.required],
    description: ['', Validators.required],
    //quantity: ['', Validators.required]
  });
  
  statusPart = [
    { value: "Activo", name:"Activo" },
    { value: "Inactivo", name:"Inactivo" }
  ]

  suppliersParts = [
    { value: "HP", name: "HP" },
    { value: "Huawei", name: "Huawei" },
    { value: "Cisco", name: "Cisco" },
    { value: "IBM", name:"IBM" },
    { value: "Fortinet", name:"Fortinet" },
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    private _partsWereHouseService: PartsWerehouseService,
    private _snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.getValues();
  }

  createPart(){
    console.log('El valor del formulario es:', this.formCreatePart.value);
    
    this._partsWereHouseService.createPart(this.formCreatePart.value).subscribe(res => {
    })
    this.closeSnack();
    this.closeDialog();

  }

  closeSnack(){
    this._snackBar.open('Creacion de pieza exitoso', '', {
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack'],
    });
  }

  closeDialog(){
    this.dialogRef.close();
  }

  getValues(){
    this.formCreatePart.controls['status'].setValue('Activo');
  }
}
