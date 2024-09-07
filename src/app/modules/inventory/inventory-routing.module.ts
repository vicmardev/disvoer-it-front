import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LocationContractsComponent} from './location-contracts/location-contracts.component';
import {MakeContractsComponent} from './make-contracts/make-contracts.component';
import {ValidContractsComponent} from './validcontracts/validcontracts.component';
import {WarehouseComponent} from './warehouse/warehouse.component';
import {DetailContractsComponent} from './detail-contracts/detail-contracts.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{path: 'validcontracts', component: ValidContractsComponent},
			{path: 'location', component: LocationContractsComponent},
			{path: 'contract', component: MakeContractsComponent},
			{path: 'house', component: WarehouseComponent},
			{path: 'detail-contract', component: DetailContractsComponent},
			{path: '**', redirectTo: 'validcontracts', pathMatch: 'full'},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class InventoryRoutingModule {}
