import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../helpers';
import {HomeComponent} from './home/home.component';
import {TicketsAlertsInventoryModule} from './tickets-alerts-inventory/tickets-alerts-inventory.module';
import {PartsWerehouseModule} from './parts-werehouse/parts-werehouse.module';
import {PartsComponent} from './parts-werehouse/parts/parts.component';
import {InventoryModule} from '../modules/inventory/inventory.module';
import {HelpCenterRoutingModule} from '../modules/help-center/help-center-routing.module';
import {ManageModule} from '../modules/manage/manage.module';
import {HomeModule} from '../modules/home/home.module';
import {AlertsModule} from '../modules/alerts/alerts.module';
import {PurcharseOrdersModule} from '../modules/purcharse-orders/purcharse-orders.module';
import {QuotesModule} from '../modules/quotes/quotes.module';
import {TopologiesModule} from '../modules/topologies/topologies.module';
import {DiscoveryModule} from '../modules/discovery/discovery.module';
//All Modules
const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		children: [
			{
				path: 'inventory',
				loadChildren: () =>
					import('../modules/inventory/inventory.module').then(m => InventoryModule),
			},
			{
				path: 'help-center',
				loadChildren: () =>
					import('../modules/help-center/help-center.module').then(
						m => HelpCenterRoutingModule
					),
			},
			{
				path: 'manage',
				loadChildren: () =>
					import('../modules/manage/manage-routing.module').then(m => ManageModule),
			},
			{
				path: 'purcharse',
				loadChildren: () =>
					import('../modules/purcharse-orders/purcharse-orders-routing.module').then(
						m => PurcharseOrdersModule
					),
			},
			{
				path: 'topologies',
				loadChildren: () =>
					import('../modules/topologies/topologies-routing.module').then(
						m => TopologiesModule
					),
			},
			{
				path: 'quotes',
				loadChildren: () =>
					import('../modules/quotes/quotes-routing.module').then(m => QuotesModule),
			},
			{
				path: 'home',
				loadChildren: () => import('../modules/home/home.module').then(m => HomeModule),
			},

			{
				path: 'alarms',
				loadChildren: () =>
					import('../modules/alerts/alerts.module').then(m => AlertsModule),
			},

			{
				path: 'discovery',
				loadChildren: () =>
					import('../modules/discovery/discovery.module').then(m => DiscoveryModule),
			},

			{
				path: 'ticketsAlerts',
				loadChildren: () =>
					import('./tickets-alerts-inventory/tickets-alerts-inventory.module').then(
						m => TicketsAlertsInventoryModule
					),
			},
			{
				path: 'partsWerehouse',
				loadChildren: () =>
					import('./parts-werehouse/parts-werehouse-routing.module').then(
						m => PartsWerehouseModule
					),
			},
			{path: 'parts', component: PartsComponent, canActivate: [AuthGuard]},
			{path: '**', redirectTo: 'home', pathMatch: 'full'},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PagesRoutingModule {}
