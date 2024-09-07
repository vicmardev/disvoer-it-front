import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRoutingModule} from './home-routing.module';
import {GraphicsComponent} from './graphics/graphics.component';
import {MaterialModule} from '../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HighchartsChartModule} from 'highcharts-angular';
import {MatTableExporterModule} from 'mat-table-exporter';
import {NgApexchartsModule} from 'ng-apexcharts';

@NgModule({
	declarations: [GraphicsComponent],
	imports: [
		CommonModule,
		HomeRoutingModule,
		MaterialModule,
		FlexLayoutModule,
		HighchartsChartModule,
		MatTableExporterModule,
		NgApexchartsModule,
	],
})
export class HomeModule {}
