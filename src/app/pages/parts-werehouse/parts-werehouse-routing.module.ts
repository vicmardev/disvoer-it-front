import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PartsComponent} from './parts/parts.component';
const routes: Routes = [
	{path: '', children: [{path: 'parts', component: PartsComponent}]},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PartsWerehouseRoutingModule {}
