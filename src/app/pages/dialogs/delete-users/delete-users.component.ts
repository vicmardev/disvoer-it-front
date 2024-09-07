import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-delete-users',
  templateUrl: './delete-users.component.html',
  styleUrls: ['./delete-users.component.scss']
})
export class DeleteUsersComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private accountService: AccountService,

  ) { }

  ngOnInit(): void {

    
  }

  deleteUser() {
    const id = this.data.id;
      this.accountService.delete(id).subscribe(()=>{
        this.dialogRef.close();
      })
  }
}
