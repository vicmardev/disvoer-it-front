import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TicketsAlertsInventoryRoutingModule} from './tickets-alerts-inventory-routing.module';
import {AlertsComponent} from './alerts/alerts.component';
import {InventoryTicketsComponent} from './inventory-tickets/inventory-tickets.component';
import {HomeTicketsComponent} from './home-tickets/home-tickets.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MaterialModule} from 'src/app/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import {NgApexchartsModule} from 'ng-apexcharts';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {MatGridListModule} from '@angular/material/grid-list';
import {RatingModule} from 'ng-starrating';
import {NgxStarRatingModule} from 'ngx-star-rating';
import {StepperComponent} from './alerts/components/stepper/stepper.component';
import {CloseDownloadComponent} from './alerts/components/stepper/close-download/close-download.component';
import {PreliminaryInfoComponent} from './alerts/components/stepper/preliminary-info/preliminary-info.component';
import {IncidentDetailsComponent} from './alerts/components/stepper/incident-details/incident-details.component';
import {ModalComponent} from './alerts/components/stepper/incident-details/modal/modal.component';
import {SteppersComponent} from './inventory-tickets/components/steppers/steppers.component';
import {PreliminaryInfoInvComponent} from './inventory-tickets/components/steppers/preliminary-info-inv/preliminary-info-inv.component';
import {CloseDownloadInvComponent} from './inventory-tickets/components/steppers/close-download-inv/close-download-inv.component';
import {CustomerSupportComponent} from './customer-support/customer-support.component';
import {ClientInfoComponent} from './alerts/components/stepper/client-info/client-info.component';
import {ClientResObsComponent} from './alerts/components/stepper/client-res-obs/client-res-obs.component';
import {TicketsCalendarComponent} from './tickets-calendar/tickets-calendar.component';
import {FullCalendarModule} from '@fullcalendar/angular';
//import { GridComponent } from '@syncfusion/ej2-angular-grids';
//import { saveAs } from 'file-saver';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {EditTaskComponent} from './tickets-calendar/dialogs/edit-task/edit-task.component';
import {AddTicketComponent} from './tickets-calendar/dialogs/add-task/add-task.component';

FullCalendarModule.registerPlugins([
	// register FullCalendar plugins
	dayGridPlugin,
	interactionPlugin,
	timeGridPlugin,
	listPlugin,
]);

//import { jsPDF ,jsPDFAPI } from 'jspdf';
//import { jsPDFOptions } from 'jspdf';

@NgModule({
	declarations: [
		AlertsComponent,
		InventoryTicketsComponent,
		HomeTicketsComponent,
		StepperComponent,
		CloseDownloadComponent,
		PreliminaryInfoComponent,
		IncidentDetailsComponent,
		ModalComponent,
		PreliminaryInfoInvComponent,
		CloseDownloadInvComponent,
		SteppersComponent,
		CustomerSupportComponent,
		ClientInfoComponent,
		ClientResObsComponent,
		TicketsCalendarComponent,
		AddTicketComponent,
		EditTaskComponent,
	],
	imports: [
		CommonModule,
		TicketsAlertsInventoryRoutingModule,
		MatTabsModule,
		MatIconModule,
		MaterialModule,
		ReactiveFormsModule,
		MatStepperModule,
		NgApexchartsModule,
		FlexLayoutModule,
		MatGridListModule,
		NgxStarRatingModule,
		RatingModule,
		FormsModule,
		FullCalendarModule,
		FlexModule,
		//jsPDF,
	],
})
export class TicketsAlertsInventoryModule {}
