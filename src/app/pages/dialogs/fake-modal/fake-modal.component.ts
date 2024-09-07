import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-fake-modal',
  templateUrl: './fake-modal.component.html',
  styleUrls: ['./fake-modal.component.scss']
})
export class FakeModalComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<any>,
  ) { }

  ngOnInit(): void {
  }


  closeDialog() {
    this.dialogRef.close();
    
  }

}
