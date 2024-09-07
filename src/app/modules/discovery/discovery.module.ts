import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DiscoveryRoutingModule} from './discovery-routing.module';
import {DeviceDiscoveryComponent} from './device-discovery/device-discovery.component';
import {MaterialModule} from 'src/app/material/material.module';
import {DeviceTableComponent} from './device-table/device-table.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
	declarations: [DeviceDiscoveryComponent, DeviceTableComponent],
	imports: [CommonModule, DiscoveryRoutingModule, MaterialModule, ReactiveFormsModule],
})
export class DiscoveryModule {}
