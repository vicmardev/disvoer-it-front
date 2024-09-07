import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InventoryRoutingModule} from './inventory-routing.module';
import {MaterialModule} from 'src/app/material/material.module';
import {MatTableModule} from '@angular/material/table';
import {ValidContractsComponent} from './validcontracts/validcontracts.component';
import {MatTableExporterModule} from 'mat-table-exporter';
import {InventoryStatusPipe} from 'src/app/pipes/inventory-status.pipe';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ListEquipmentsComponent} from './validcontracts/dialogs/list-equipments/list-equipments.component';
import {EditEquipmentComponent} from './validcontracts/dialogs/edit-equipment/edit-equipment.component';
import {AddBudgetComponent} from './validcontracts/dialogs/add-budget/add-budget.component';
import {LocationContractsComponent} from './location-contracts/location-contracts.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {MakeContractsComponent} from './make-contracts/make-contracts.component';
import {ProgressComponent} from './make-contracts/dialogs/progress/progress.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ImportExcelComponent} from './validcontracts/dialogs/import-excel/import-excel.component';
import {ImportExcelErrorsComponent} from './validcontracts/dialogs/import-excel-errors/import-excel-errors.component';
import {WarehouseComponent} from './warehouse/warehouse.component';
import {PartsDetailsComponent} from './warehouse/components/parts-details/parts-details.component';
import {DetailContractsComponent} from './detail-contracts/detail-contracts.component';
import {RegisterPartsComponent} from './warehouse/dialogs/register-parts/register-parts.component';
import {QrCodeComponent} from './warehouse/dialogs/qr-code/qr-code.component';
import {QrReaderComponent} from './warehouse/dialogs/qr-reader/qr-reader.component';
import {QRCodeModule} from 'angularx-qrcode';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {NewPartComponent} from './warehouse/dialogs/new-part/new-part.component';
import {EngineersComponent} from './detail-contracts/dialogs/engineers/engineers.component';
import {EditAliasComponent} from './validcontracts/dialogs/edit-alias/edit-alias.component';
import {EditDatacenterComponent} from './validcontracts/dialogs/edit-datacenter/edit-datacenter.component';

@NgModule({
	declarations: [
		ValidContractsComponent,
		InventoryStatusPipe,
		ListEquipmentsComponent,
		EditEquipmentComponent,
		AddBudgetComponent,
		LocationContractsComponent,
		MakeContractsComponent,
		ProgressComponent,
		EditDatacenterComponent,
		EditAliasComponent,
		ImportExcelComponent,
		ImportExcelErrorsComponent,
		DetailContractsComponent,
		EngineersComponent,
		WarehouseComponent,
		PartsDetailsComponent,
		RegisterPartsComponent,
		QrCodeComponent,
		QrReaderComponent,
		NewPartComponent,
	],
	imports: [
		CommonModule,
		FlexLayoutModule,
		InventoryRoutingModule,
		MaterialModule,
		MatTableModule,
		MatTableExporterModule,
		LeafletModule,
		FormsModule,
		ReactiveFormsModule,
		QRCodeModule,
		ZXingScannerModule,
	],
})
export class InventoryModule {}
