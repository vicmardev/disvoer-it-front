import {NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PurcharseOrdersRoutingModule} from './purcharse-orders-routing.module';
import {ListOrdersComponent} from './list-orders/list-orders.component';
//import {CreateOrderComponent} from './dialogs/create-order/create-order.component';
import {CreateOrderComponent} from './list-orders/dialogs/create-order/create-order.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MaterialModule} from 'src/app/material/material.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import { EditOrderComponent } from './list-orders/dialogs/edit-order/edit-order.component';
import { UpdateListComponent } from './list-orders/dialogs/update-list/update-list.component';
import { UpdateOrderComponent } from './list-orders/dialogs/update-order/update-order.component';
import { DeleteOrderComponent } from './list-orders/dialogs/delete-order/delete-order.component';

@NgModule({
	declarations: [ListOrdersComponent, CreateOrderComponent, EditOrderComponent, UpdateListComponent, UpdateOrderComponent, DeleteOrderComponent],
	schemas:[
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	],
	imports: [
		CommonModule,
		PurcharseOrdersRoutingModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule,
		MaterialModule,
		MatDatepickerModule,
		MatNativeDateModule,
		PdfViewerModule,
	],
})
export class PurcharseOrdersModule {}
