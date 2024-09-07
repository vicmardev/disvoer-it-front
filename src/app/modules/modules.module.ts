import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InventoryModule} from './inventory/inventory.module';
import {HelpCenterModule} from './help-center/help-center.module';
import {ManageRoutingModule} from './manage/manage-routing.module';
import {PurcharseOrdersModule} from './purcharse-orders/purcharse-orders.module';
import {QuotesModule} from './quotes/quotes.module';
import {CreateOrderComponent} from './purcharse-orders/list-orders/dialogs/create-order/create-order.component';
import {TopologiesModule} from './topologies/topologies.module';
import {DiscoveryModule} from './discovery_old/discovery.module';

@NgModule({
	declarations: [CreateOrderComponent],
	imports: [
		CommonModule,
		InventoryModule,
		PurcharseOrdersModule,
		QuotesModule,
		HelpCenterModule,
		ManageRoutingModule,
		TopologiesModule,
		DiscoveryModule,
	],
})
export class ModulesModule {}
