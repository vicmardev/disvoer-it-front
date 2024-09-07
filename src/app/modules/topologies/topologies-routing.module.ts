import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTopologiesComponent } from './list-topologies/list-topologies.component';

const routes: Routes = [
  {
		path: '',
		children: [
			{path: 'topologies', component: ListTopologiesComponent},
			{path: '**', redirectTo: 'topologies', pathMatch: 'full'},
		],
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopologiesRoutingModule { }
