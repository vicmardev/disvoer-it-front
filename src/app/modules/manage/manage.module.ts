import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManageRoutingModule} from './manage-routing.module';
import {FlexModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'src/app/material/material.module';
import {TableUsersComponent} from './table-users/table-users.component';
import {AddEditUserComponent} from './table-users/dialogs/add-edit-user/add-edit-user.component';
import {AddContractsComponent} from './table-users/dialogs/add-contracts/add-contracts.component';
import {DeleteUserComponent} from './table-users/dialogs/delete-user/delete-user.component';
import {ImageProfileComponent} from './table-users/dialogs/image-profile/image-profile.component';
import {ProfileComponent} from './profile/profile.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {CatalogsComponent} from './catalogs/catalogs.component';
import {CustomersComponent} from './catalogs/customers/customers.component';
import {SupportOperatorsComponent} from './catalogs/support-operators/support-operators.component';
import { AddCustomerComponent } from './catalogs/dialogs/add-customer/add-customer.component';
import { DeleteCustomerComponent } from './catalogs/dialogs/delete-customer/delete-customer.component';
import { AddSupportOperatorComponent } from './catalogs/dialogs/add-support-operator/add-support-operator/add-support-operator.component';
import { DeleteSupportOperatorComponent } from './catalogs/dialogs/delete-support-operator/delete-support-operator.component';
import { BrandsComponent } from './catalogs/brands/brands.component';
import { ProvidersComponent } from './catalogs/providers/providers.component';
import { SLAsComponent } from './catalogs/slas/slas.component';
import { StoresComponent } from './catalogs/stores/stores.component';
import { TypePartsComponent } from './catalogs/type-parts/type-parts.component';
import { AddBrandComponent } from './catalogs/dialogs/add-brand/add-brand.component';
import { DeleteBrandComponent } from './catalogs/dialogs/delete-brand/delete-brand.component';
import { EditBrandComponent } from './catalogs/dialogs/edit-brand/edit-brand.component';
import { AddProviderComponent } from './catalogs/dialogs/add-provider/add-provider.component';
import { DeleteProviderComponent } from './catalogs/dialogs/delete-provider/delete-provider.component';
import { EditCustomerComponent } from './catalogs/dialogs/edit-customer/edit-customer.component';
import { EditProviderComponent } from './catalogs/dialogs/edit-provider/edit-provider.component';
import { EditSupportOperatorComponent } from './catalogs/dialogs/edit-support-operator/edit-support-operator.component';

@NgModule({
	declarations: [
		TableUsersComponent,
		AddEditUserComponent,
		AddContractsComponent,
		DeleteUserComponent,
		ImageProfileComponent,
		ProfileComponent,
		CatalogsComponent,
		CustomersComponent,
		SupportOperatorsComponent,
  AddCustomerComponent,
  DeleteCustomerComponent,
  AddSupportOperatorComponent,
  DeleteSupportOperatorComponent,
  BrandsComponent,
  ProvidersComponent,
  SLAsComponent,
  StoresComponent,
  TypePartsComponent,
  AddBrandComponent,
  DeleteBrandComponent,
  EditBrandComponent,
  AddProviderComponent,
  DeleteProviderComponent,
  EditCustomerComponent,
  EditProviderComponent,
  EditSupportOperatorComponent,
	],
	imports: [
		CommonModule,
		ManageRoutingModule,
		//FlexModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		MatSlideToggleModule,
	],
})
export class ManageModule {}
