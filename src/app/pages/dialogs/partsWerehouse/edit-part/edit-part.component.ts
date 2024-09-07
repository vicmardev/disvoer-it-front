import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartsWerehouseService } from 'src/app/services/partsWerehouse/parts-werehouse.service';

@Component({
  selector: 'app-edit-part',
  templateUrl: './edit-part.component.html',
  styleUrls: ['./edit-part.component.scss']
})
export class EditPartComponent implements OnInit {

  public formEditPart = this._formBuilder.group({
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
    quantity: ['', Validators.required]
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
    this.getValuesForm();
  }

  getValuesForm(){
    //Get Values from DataBase
    this.formEditPart.controls['type'].setValue(this.data.info.type);
    this.formEditPart.controls['brand'].setValue(this.data.info.brand);
    this.formEditPart.controls['model'].setValue(this.data.info.model);
    this.formEditPart.controls['serialNumber'].setValue(this.data.info.serialNumber);
    this.formEditPart.controls['partNumber'].setValue(this.data.info.partNumber);
    this.formEditPart.controls['capacity'].setValue(this.data.info.capacity);
    this.formEditPart.controls['contract'].setValue(this.data.info.contract);
    this.formEditPart.controls['status'].setValue(this.data.info.status);
    this.formEditPart.controls['supplier'].setValue(this.data.info.supplier);
    this.formEditPart.controls['quantity'].setValue(this.data.info.quantity);
    this.formEditPart.controls['description'].setValue(this.data.info.description);
  }

  closeDialog(){
    this.dialogRef.close();
  }

  updatePart(){
    let id = this.data.info.id;
    this._partsWereHouseService;
  }

}
