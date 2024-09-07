import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertsRoutingModule} from './alerts.routing';
import {MaterialModule} from '../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HighchartsChartModule} from 'highcharts-angular';
import {MatTableExporterModule} from 'mat-table-exporter';
import {RealTimeComponent} from './real-time/real-time.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import {TicketsAlertsInventoryModule} from '../pages/tickets-alerts-inventory/tickets-alerts-inventory.module';
import {ServiceTableComponent} from './real-time/host-card/service-table/service-table.component';
import {HostCardComponent} from './real-time/host-card/host-card.component';
import {ArchitectureComponent} from './architecture/architecture.component';
import {NgxOrgChartModule} from 'ngx-org-chart';

@NgModule({
	declarations: [
		RealTimeComponent,
		ServiceTableComponent,
		HostCardComponent,
		ArchitectureComponent,
	],
	imports: [
		CommonModule,
		AlertsRoutingModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		FlexLayoutModule,
		HighchartsChartModule,
		MatTableExporterModule,
		NgApexchartsModule,
		TicketsAlertsInventoryModule,
		NgxOrgChartModule,
	],
})
export class AlertsModule {}
