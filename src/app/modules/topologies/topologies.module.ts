import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopologiesRoutingModule } from './topologies-routing.module';
import { ListTopologiesComponent } from './list-topologies/list-topologies.component';


@NgModule({
  declarations: [
    ListTopologiesComponent
  ],
  imports: [
    CommonModule,
    TopologiesRoutingModule
  ],
  schemas:[
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	],
})
export class TopologiesModule { }
