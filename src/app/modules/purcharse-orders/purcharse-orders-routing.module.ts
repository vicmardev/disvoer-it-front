import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListOrdersComponent} from './list-orders/list-orders.component';
//import {CreateOrderComponent} from './create-order/create-order.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{path: 'orders', component: ListOrdersComponent},
			{path: '**', redirectTo: 'orders', pathMatch: 'full'},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PurcharseOrdersRoutingModule {}
