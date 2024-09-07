import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { TransitionCheckState } from '@angular/material/checkbox';
@Component({
  selector: 'app-preliminary-info-inv',
  templateUrl: './preliminary-info-inv.component.html',
  styleUrls: ['./preliminary-info-inv.component.scss']
})
export class PreliminaryInfoInvComponent implements OnInit {
  @Input() preliminaryInfo: any;
  isShown: boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log("El valor de preliminaryInfo es:", this.preliminaryInfo )
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("El valor de preliminaryInfo es:", this.preliminaryInfo )
    if (this.preliminaryInfo.responsableReassig || this.preliminaryInfo.responsableReassig !=  ""){
      this.isShown = true;
    }
    /*
    if( this.preliminaryInfo.responsableReassig )
    {
      if(this.preliminaryInfo.responsableReassig !=""){
        this.isShown = true;
      }
    }*/
    
  }

}
