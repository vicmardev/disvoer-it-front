import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'src/app/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PartsWerehouseRoutingModule} from './parts-werehouse-routing.module';
import {PartsComponent} from './parts/parts.component';
import {PartsDetailsComponent} from './parts-details/parts-details.component';

@NgModule({
	declarations: [PartsComponent, PartsDetailsComponent],
	imports: [
		CommonModule,
		PartsWerehouseRoutingModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
	],
})
export class PartsWerehouseModule {}
