import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GraphicsComponent} from './graphics/graphics.component';
import {HistoricalComponent} from './historical/historical.component';

const routes: Routes = [
	{path: 'graphics', component: GraphicsComponent},
	{path: 'historical', component: HistoricalComponent},
	{path: '**', redirectTo: 'graphics', pathMatch: 'full'},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AlertsRoutingModule {}
