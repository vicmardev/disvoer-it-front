import {APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthModule} from './auth/auth.module';
import {ErrorModule} from './error/error.module';
import {PagesModule} from './pages/pages.module';

//material
import {ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HighchartsChartModule} from 'highcharts-angular';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {appInitializer, JwtInterceptor, ErrorInterceptor} from './helpers';
import {AuthService} from './auth/auth.service';
import {VerifyEmailComponent} from './auth/verify-email/verify-email.component';
import {MatTableExporterModule} from 'mat-table-exporter';
import {MatFileUploadModule} from 'angular-material-fileupload';
import {NgApexchartsModule} from 'ng-apexcharts';
import {ChangePhotoComponent} from './pages/dialogs/change-photo/change-photo.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatStepperModule} from '@angular/material/stepper';
import {FullCalendarModule} from '@fullcalendar/angular';
//import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
//import { FormsModule } from '@angular/forms';
//import { DndDirective } from './pages/contracts-customers/contracts-customers/dnd.directive';
//import { AppComponent } from './app.component';
//import { ProgressComponent } from './pages/contracts-customers/contracts-customers/progress/progress.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {CurrencyPipe} from '@angular/common';

FullCalendarModule.registerPlugins([
	// register FullCalendar plugins
	dayGridPlugin,
	interactionPlugin,
]);

@NgModule({
	declarations: [
		AppComponent,
		ChangePhotoComponent,
		//NgxGraphModule,
		//DndDirective,
		//ProgressComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AuthModule,
		RouterModule,
		FormsModule,
		ErrorModule,
		PagesModule,
		HighchartsChartModule,
		MatCheckboxModule,
		//material
		MatTabsModule,
		ReactiveFormsModule,
		MatNativeDateModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatTableExporterModule,
		MatFileUploadModule,
		NgApexchartsModule,
		ImageCropperModule,
		MatStepperModule,
		MatGridListModule,
		FullCalendarModule,
		MatSlideToggleModule,
		
	],
	schemas:[
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: appInitializer,
			multi: true,
			deps: [AuthService],
		},
		{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
		CurrencyPipe,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}