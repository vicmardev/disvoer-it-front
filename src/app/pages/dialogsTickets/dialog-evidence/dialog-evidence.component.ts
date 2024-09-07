import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dialog-evidence',
  templateUrl: './dialog-evidence.component.html',
  styleUrls: ['./dialog-evidence.component.scss']
})
export class DialogEvidenceComponent implements OnInit {
  ticketImgUrl = `${environment.ticketImgUrl}/`;
  
  constructor(
    @Inject(
      MAT_DIALOG_DATA) public data:any,
  ) {
    
   }

  ngOnInit(): void {
    
    
  }

}
