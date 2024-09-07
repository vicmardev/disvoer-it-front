import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {FaqsComponent} from './faqs/faqs.component';
import {GuidesComponent} from './guides/guides.component';
import {KnowledgeComponent} from './knowledge/knowledge.component';
import {SupportComponent} from './support/support.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{path: 'faqs', component: FaqsComponent},
			{path: 'guides', component: GuidesComponent},
			{path: 'support', component: SupportComponent},
			{path: 'about', component: AboutComponent},
			{path: 'know', component: KnowledgeComponent},
			{path: '**', redirectTo: 'faqs', pathMatch: 'full'},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class HelpCenterRoutingModule {}
