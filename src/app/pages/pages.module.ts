import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesRoutingModule} from './pages-routing.module';
import {RouterModule} from '@angular/router';

//Agregar  todos los componentes de Material
import {MaterialModule} from '../material/material.module';
import {HomeComponent} from './home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatGridListModule} from '@angular/material/grid-list';
import {RatingModule} from 'ng-starrating';
//import { jsPDFAPI,jsPDF } from 'jspdf';

//flex
import {FlexLayoutModule} from '@angular/flex-layout';
import {HighchartsChartModule} from 'highcharts-angular';
import {AddInventoryComponent} from './dialogs/add-inventory/add-inventory.component';
import {DeleteRowInventoryComponent} from './dialogs/delete-row-inventory/delete-row-inventory.component';
import {MatTableExporterModule} from 'mat-table-exporter';
import {UpdateFileComponent} from './dialogs/update-file/update-file.component';
import {MatFileUploadModule} from 'angular-material-fileupload';
import {InfoRowInventoryComponent} from './dialogs/info-row-inventory/info-row-inventory.component';
import {CreateTicketInventoryComponent} from './dialogs/create-ticket-inventory/create-ticket-inventory.component';
import {RolesPipe} from '../pipes/roles.pipe';
import {DialogEvidenceComponent} from './dialogsTickets/dialog-evidence/dialog-evidence.component';
import {DialogEditComponent} from './dialogsTickets/dialog-edit/dialog-edit.component';
import {DialogInfoComponent} from './dialogsTickets/dialog-info/dialog-info.component';
import {DeleteUsersComponent} from './dialogs/delete-users/delete-users.component';
import {ImgEquipmentPipe} from '../pipes/img-equipment.pipe';
import {NgApexchartsModule} from 'ng-apexcharts';
import {CreateTicketAlertComponent} from './dialogs/tickets/create-ticket-alert/create-ticket-alert.component';
import {AppproveTicketComponent} from './dialogs/ticket-alert/appprove-ticket/appprove-ticket.component';
import {ReassignTicketComponent} from './dialogs/ticket-alert/reassign-ticket/reassign-ticket.component';
import {AddEditPartComponent} from './dialogs/partsWerehouse/add-edit-part/add-edit-part.component';
import {DeletePartComponent} from './dialogs/partsWerehouse/delete-part/delete-part.component';
import {EditPartComponent} from './dialogs/partsWerehouse/edit-part/edit-part.component';
import {TakePartsComponent} from './dialogs/partsWerehouse/take-parts/take-parts.component';
import {RunCommandsComponent} from './dialogs/run-commands/run-commands.component';
import {FakeModalComponent} from './dialogs/fake-modal/fake-modal.component';
import {FakeModal2Component} from './dialogs/fake-modal/fake-modal2/fake-modal2.component';
import {DownloadPdfsComponent} from './dialogs/ticket-alert/download-pdfs/download-pdfs.component';
import {PageTitlePipe} from '../pipes/page-title.pipe';
import {WaitModalComponent} from './dialogs/wait-modal/wait-modal.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {UploadFileComponent} from './dialogs/partsWerehouse/upload-file/upload-file.component';
import {ShowErrorsComponent} from './dialogs/partsWerehouse/show-errors/show-errors.component';
import {EditAliasTicketComponent} from './dialogs/tickets/edit-alias-ticket/edit-alias-ticket.component';
import {ReplacePartComponent} from './dialogs/replace-part/replace-part.component';
import {ShowExcelErrorsComponent} from './dialogs/inventory/show-excel-errors/show-excel-errors.component';
import {RegisterIncomingComponent} from './dialogs/parts-warehouse/register-incoming/register-incoming.component';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {QrReaderComponent} from './dialogs/qr-reader/qr-reader.component';
import {NewPartComponent} from './dialogs/parts-warehouse/new-part/new-part.component';
import {QRCodeModule} from 'angularx-qrcode';
import {QrCodeComponent} from './dialogs/qr-code/qr-code.component';
import {InventoryModule} from '../modules/inventory/inventory.module';
import {AlertsModule} from '../modules/alerts/alerts.module';

@NgModule({
	declarations: [
		HomeComponent,
		AddInventoryComponent,
		DeleteRowInventoryComponent,
		UpdateFileComponent,
		InfoRowInventoryComponent,
		CreateTicketInventoryComponent,
		RolesPipe,
		DialogEvidenceComponent,
		DialogEditComponent,
		DialogInfoComponent,
		DeleteUsersComponent,
		ImgEquipmentPipe,
		CreateTicketAlertComponent,
		AppproveTicketComponent,
		ReassignTicketComponent,
		AddEditPartComponent,
		DeletePartComponent,
		EditPartComponent,
		TakePartsComponent,
		RunCommandsComponent,
		FakeModalComponent,
		FakeModal2Component,
		DownloadPdfsComponent,
		PageTitlePipe,
		WaitModalComponent,
		UploadFileComponent,
		ShowErrorsComponent,
		CreateTicketInventoryComponent,
		EditAliasTicketComponent,
		ReplacePartComponent,
		ShowExcelErrorsComponent,
		RegisterIncomingComponent,
		QrReaderComponent,
		NewPartComponent,
		QrCodeComponent,
	],
	imports: [
		CommonModule,
		PagesRoutingModule,
		MaterialModule,
		RouterModule,
		FlexLayoutModule,
		HighchartsChartModule,
		FormsModule,
		ReactiveFormsModule,
		MatTableExporterModule,
		MatFileUploadModule,
		NgApexchartsModule,
		ImageCropperModule,
		MatGridListModule,
		RatingModule,
		MatSlideToggleModule,
		LeafletModule,
		ZXingScannerModule,
		InventoryModule,
		QRCodeModule,
		AlertsModule,
	],
	exports: [
		//jsPDF
	],
})
export class PagesModule {}
