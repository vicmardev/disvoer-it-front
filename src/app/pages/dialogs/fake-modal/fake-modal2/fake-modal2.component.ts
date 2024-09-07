import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fake-modal2',
  templateUrl: './fake-modal2.component.html',
  styleUrls: ['./fake-modal2.component.scss']
})
export class FakeModal2Component implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<any>,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();

    this._snackBar.open('Pieza solicitada en almacén','',
      {
        duration: 3500,
        verticalPosition: 'top',
        /* horizontalPosition: 'center', */
        panelClass: ['background-snack']
      }
    );
  }


  /* closeSnack() {
    this._snackBar.open('Pieza reemplazada.', '', {
      duration: 1000,
      panelClass: ['background-snack'],
    });
  } */

}
