import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HelpCenterRoutingModule} from './help-center-routing.module';
import {FaqsComponent} from './faqs/faqs.component';
import {GuidesComponent} from './guides/guides.component';
import {SupportComponent} from './support/support.component';
import {AboutComponent} from './about/about.component';
import {FlexModule} from '@angular/flex-layout';
import {MaterialModule} from 'src/app/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CreateFaqComponent} from './faqs/dialogs/create-faq/create-faq.component';
import {DeleteFaqComponent} from './faqs/dialogs/delete-faq/delete-faq.component';
import {AddEditFaqComponent} from './faqs/dialogs/add-edit-faq/add-edit-faq.component';
import {ReportProblemComponent} from './about/dialogs/report-problem/report-problem.component';
import {TermsConditionsComponent} from './about/dialogs/terms-conditions/terms-conditions.component';
import {KnowledgeComponent} from './knowledge/knowledge.component';
import {SafePipe} from 'src/app/pipes/safe.pipe';
import {DeleteFileComponent} from './knowledge/dialogs/delete-file/delete-file.component';
import {AddFilesComponent} from './knowledge/dialogs/add-files/add-files.component';

@NgModule({
	declarations: [
		FaqsComponent,
		GuidesComponent,
		SupportComponent,
		AboutComponent,
		CreateFaqComponent,
		DeleteFaqComponent,
		AddEditFaqComponent,
		ReportProblemComponent,
		TermsConditionsComponent,
		KnowledgeComponent,
		SafePipe,
		DeleteFileComponent,
		AddFilesComponent,
	],
	imports: [
		CommonModule,
		HelpCenterRoutingModule,
		FlexModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
	],
})
export class HelpCenterModule {}
