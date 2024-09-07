import { Component, OnInit, Inject,SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PartsWerehouseService } from 'src/app/services/partsWerehouse/parts-werehouse.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-take-parts',
  templateUrl: './take-parts.component.html',
  styleUrls: ['./take-parts.component.scss']
})
export class TakePartsComponent implements OnInit {
  isLoading: boolean = false;
  listPartsSerial: any;
  isShow: boolean = false;

  public formTakePart = this._formBuilder.group({
    model: ['', Validators.required],
    quantity: [0, Validators.required]
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    private _snackBar: MatSnackBar,
    private _partsWereHouseService : PartsWerehouseService
  ) { }

  ngOnInit(): void {
    this.getValuesForm();
    console.log("Valor de data en takePart es:", this.data.info.parts);
    this.listPartsSerial = this.data.info.parts;
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    setTimeout(() => {
      console.log("El valor de quantity es: ",this.formTakePart.value.quantity)
      if(this.formTakePart.value.quantity === 0 ){
        this.isShow = true;
      }
    });
  }

  closeDialog(){
    this.dialogRef.close();
  }

  getValuesForm(){
    this.formTakePart.controls['model'].setValue(this.data.info.model);
    this.formTakePart.controls['quantity'].setValue(this.data.info.quantity);
  }

  takePart(serial:any){
    console.log("La pieza tomada es:",serial );
    console.log("El valor de quantity es: ",this.formTakePart.value.quantity)
      if(this.formTakePart.value.quantity === 1 ){
        this.isShow = true;
      }
    this._partsWereHouseService.subtractPart(serial).subscribe((res:any) =>{
      this.listPartsSerial= this.listPartsSerial.filter((part:number) => part != serial)
      let quantity = this.formTakePart.value.quantity
      this.formTakePart.controls['quantity'].setValue(quantity-1);
      this.succesSnack();
    })
    
  }

  validateAvailableParts(){
    /*
    if(this.formTakePart.value.quantity > this.data.info.quantity){
      this.errorSnack();
    }*/
    console.log(this.formTakePart.value.quantity);
    
    if(this.formTakePart.value.quantity === 1 ){
      /*Enviar correo de que no hay piezas de X Modelo*/
      
      console.log("Se enviara un correo al almacenista");
      this.isLoading = true;
      this.isShow = true;
      this._partsWereHouseService.sendEmail(this.formTakePart.value).subscribe({
        next:()=>{
          this.formTakePart.controls['model'].setValue('');
          this.formTakePart.controls['quantity'].setValue('');
          this.emailSnack();
          this.closeDialog();
        }
      })
     
      
      
      
    }
    else {
      this.succesSnack();
    }
  }

  succesSnack(){
    this._snackBar.open('Pieza tomada correctamente', '',{
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack-info']
    });
  }

  errorSnack(){
    this._snackBar.open('Piezas insuficientes en inventario', '',{
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack-red']
    });
  }

  emailSnack(){
    this._snackBar.open('Se ha enviado un correo para notificar la necesidad de abastecimiento', '',{
      duration: 3500,
        verticalPosition: 'top',
      panelClass: ['background-snack']
    })
  }

}
