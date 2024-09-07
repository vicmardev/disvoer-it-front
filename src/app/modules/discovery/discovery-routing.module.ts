import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeviceDiscoveryComponent} from './device-discovery/device-discovery.component';

const routes: Routes = [
	{path: 'devices', component: DeviceDiscoveryComponent},
	{path: '', redirectTo: 'devices', pathMatch: 'full'},
	{path: '**', redirectTo: 'graphics', pathMatch: 'full'},
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DiscoveryRoutingModule {}
