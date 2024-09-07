import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertsComponent } from './alerts/alerts.component';
import { HomeTicketsComponent } from './home-tickets/home-tickets.component';
import { InventoryTicketsComponent } from './inventory-tickets/inventory-tickets.component';
import { TicketsCalendarComponent } from './tickets-calendar/tickets-calendar.component';


const routes: Routes = [
  { path: '',
  children:[
    {path: 'home', component: HomeTicketsComponent},
    {path: 'alerts', component: AlertsComponent},
    {path: 'calendar', component: TicketsCalendarComponent},
    {path: 'inventoryTickets', component: InventoryTicketsComponent},
    {path: '**', redirectTo:'home', pathMatch:'full' },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsAlertsInventoryRoutingModule { }
