import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-home-tickets',
  templateUrl: './home-tickets.component.html',
  styleUrls: ['./home-tickets.component.scss']
})
export class HomeTicketsComponent implements OnInit {
  homeParent:any;
  allListTicket:any[] =[];
  constructor( private _ticketsService:TicketsService) { }

  ngOnInit(): void {

  }

 

}
