import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { InventoryService } from 'src/app/services/inventory/inventory.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private _invetaryService: InventoryService,
    private _snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {

  }
  aceptDeleteDialog(row: any) {
    this.closeSnack();
    this.closeDialog();
  }
  closeDialog() {
    this.dialogRef.close();
  }

  closeSnack(){
    this._snackBar.open('Contraseña actualizada.', '', {
      duration: 3500,
      verticalPosition: 'top',
      /* horizontalPosition: 'center', */
      panelClass:['background-snack']
    });

  }
}
