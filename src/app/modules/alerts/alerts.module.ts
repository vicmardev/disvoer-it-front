import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AlertsRoutingModule} from './alerts-routing.module';
import {GraphicsComponent} from './graphics/graphics.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import {MaterialModule} from '../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HistoricalComponent} from './historical/historical.component';
import {AlertsByHostComponent} from './historical/alerts-by-host/alerts-by-host.component';
import {HistoricAlertsComponent} from './historical/alerts-by-host/historic-alerts/historic-alerts.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
	declarations: [
		GraphicsComponent,
		HistoricalComponent,
		AlertsByHostComponent,
		HistoricAlertsComponent,
	],
	imports: [
		CommonModule,
		AlertsRoutingModule,
		NgApexchartsModule,
		MaterialModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
	],
})
export class AlertsModule {}
