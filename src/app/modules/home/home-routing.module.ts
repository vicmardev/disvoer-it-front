import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GraphicsComponent} from './graphics/graphics.component';
import {AuthGuard} from '../../helpers/auth.guard';

const routes: Routes = [
	{path: 'graphics', component: GraphicsComponent},
	{path: '**', redirectTo: 'graphics', pathMatch: 'full'},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HomeRoutingModule {}
