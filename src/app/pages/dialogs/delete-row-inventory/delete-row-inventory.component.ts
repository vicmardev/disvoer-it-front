import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import {MatSnackBar,MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { User } from 'src/app/models/User';



@Component({
  selector: 'app-delete-row-inventory',
  templateUrl: './delete-row-inventory.component.html',
  styleUrls: ['./delete-row-inventory.component.scss']
})
export class DeleteRowInventoryComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  comments:any;

  public deleteRow = this._formBuilder.group({
    commentsDelete:['',[Validators.required]],
  })

  idContrato: any;
  user!: User;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private _invetaryService: InventoryService,
    private _snackBar: MatSnackBar,
    private _formBuilder :FormBuilder,
    private accountService: AccountService,

  ) { }

  ngOnInit(): void {
    this.idContrato = this.data.info.Contrato;
    this.user = this.accountService.userValue;

  }
  aceptDeleteDialog(row: any) {
    let idRowDelete = row.id;
    this.comments = this.deleteRow.get('commentsDelete')?.value;

    
    this._invetaryService.deleteRowId(idRowDelete,this.comments,this.user.firstName).subscribe(res => {
    }) 
    this.closeSnack();
    this.closeDialog();
  }
  closeDialog() {
    this.dialogRef.close();
  }

  closeSnack(){
    this._snackBar.open('Eliminación de registro exitoso.', '', {
      duration: 3500,
      verticalPosition: 'top',
      /* horizontalPosition: 'center', */
      panelClass:['background-snack']
    });

  }
}
