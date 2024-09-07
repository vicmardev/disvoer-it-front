import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CatalogsComponent} from './catalogs/catalogs.component';
import {CustomersComponent} from './catalogs/customers/customers.component';
import {SupportOperatorsComponent} from './catalogs/support-operators/support-operators.component';
import {BrandsComponent} from './catalogs/brands/brands.component';
import {ProfileComponent} from './profile/profile.component';
import {AddEditUserComponent} from './table-users/dialogs/add-edit-user/add-edit-user.component';
import {TableUsersComponent} from './table-users/table-users.component';
import {ProvidersComponent} from './catalogs/providers/providers.component';
import {SLAsComponent} from './catalogs/slas/slas.component';
import {StoresComponent} from './catalogs/stores/stores.component';
import {TypePartsComponent} from './catalogs/type-parts/type-parts.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{path: 'listUsers', component: TableUsersComponent},
			{path: 'add', component: AddEditUserComponent},
			{path: 'edit/:id', component: AddEditUserComponent},
			{path: 'catalogs', component: CatalogsComponent},
			{path: 'editProfile', component: ProfileComponent},
			{path: 'user', component: ProfileComponent},
			{path: 'brands', component: BrandsComponent},
			{path: 'customers', component: CustomersComponent},
			{path: 'providers', component: ProvidersComponent},
			{path: 'slas', component: SLAsComponent},
			{path: 'stores', component: StoresComponent},
			{path: 'SupportOperators', component: SupportOperatorsComponent},
			{path: 'typeparts', component: TypePartsComponent},
			{path: '**', redirectTo: 'listUsers', pathMatch: 'full'},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ManageRoutingModule {}
