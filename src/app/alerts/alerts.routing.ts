import {CommonModule} from '@angular/common';
import {NgModule, Component} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RealTimeComponent} from './real-time/real-time.component';
import {ArchitectureComponent} from './architecture/architecture.component';

const rutas: Routes = [
	{
		path: '',
		children: [
			{path: 'realtime', component: RealTimeComponent},
			{path: 'org', component: ArchitectureComponent},
			{path: '**', redirectTo: 'warning', pathMatch: 'full'},
		],
	},
];

@NgModule({
	declarations: [],
	imports: [CommonModule, RouterModule.forChild(rutas)],
	exports: [RouterModule],
})
export class AlertsRoutingModule {}
