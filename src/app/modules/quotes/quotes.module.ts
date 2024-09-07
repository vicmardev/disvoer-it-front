import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QuotesRoutingModule} from './quotes-routing.module';
import {ListQuoteComponent} from './list-quote/list-quote.component';
import {MaterialModule} from 'src/app/material/material.module';
import {MatTableModule} from '@angular/material/table';
import {AddEditQuoteComponent} from './list-quote/dialogs/add-edit-quote/add-edit-quote.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import { DeleteQuoteComponent } from './list-quote/dialogs/delete-quote/delete-quote.component';

@NgModule({
	declarations: [ListQuoteComponent, AddEditQuoteComponent, DeleteQuoteComponent],
	imports: [
		CommonModule,
		QuotesRoutingModule,
		MaterialModule,
		MatTableModule,
		ReactiveFormsModule,
		FlexModule,
		FormsModule,
	],
})
export class QuotesModule {}
