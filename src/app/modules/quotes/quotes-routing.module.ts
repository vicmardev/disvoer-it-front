import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListQuoteComponent} from './list-quote/list-quote.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{path: 'quote', component: ListQuoteComponent},
			{path: '**', redirectTo: 'quote', pathMatch: 'full'},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class QuotesRoutingModule {}
