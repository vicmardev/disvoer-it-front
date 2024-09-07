import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { TransitionCheckState } from '@angular/material/checkbox';

@Component({
  selector: 'app-preliminary-info',
  templateUrl: './preliminary-info.component.html',
  styleUrls: ['./preliminary-info.component.scss']
})
export class PreliminaryInfoComponent implements OnInit {
  @Input() preliminaryInfo:any;
  isShown: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      console.log("El valor de preliminaryInfo es:", this.preliminaryInfo )
      console.log("El valor de solutionReassig es:", this.preliminaryInfo.solutionReassig )
      console.log("El valor de evidenceReassig es:", this.preliminaryInfo.evidenceReassig )
        if(this.preliminaryInfo.solutionReassig ){
          console.log('entrando  al  if',this.preliminaryInfo.solutionReassig);
          
          this.isShown = true;
        }
    }, );
  }

}
