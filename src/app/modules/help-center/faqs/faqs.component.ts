import {Component, OnInit} from '@angular/core';
import {HelpCenterService} from 'src/app/services/helpCenter/help-center.service';
import {User} from 'src/app/models/User';
import {MatDialog} from '@angular/material/dialog';
import {AccountService} from 'src/app/services/account/account.service';
//dialogs folder
import {CreateFaqComponent} from './dialogs/create-faq/create-faq.component';
import {DeleteFaqComponent} from './dialogs/delete-faq/delete-faq.component';
import {AddEditFaqComponent} from './dialogs/add-edit-faq/add-edit-faq.component';

@Component({
	selector: 'app-faqs',
	templateUrl: './faqs.component.html',
	styleUrls: ['./faqs.component.scss'],
})
export class FaqsComponent implements OnInit {
	//faqs!: any;
	lisQuestions: any;
	user!: User;

	constructor(
		public dialog: MatDialog,
		private _support: HelpCenterService,
		private accountService: AccountService
	) {}

	ngOnInit(): void {
		this.getAllFaqs();
		this.user = this.accountService.userValue;
	}

	getAllFaqs() {
		this._support.getAll().subscribe(res => {
			this.lisQuestions = res;
			this.lisQuestions = this.lisQuestions.sort((q1: any, q2: any) => q1._id - q2.id);
		});
	}

	createFaqDialog() {
		const dialogRef = this.dialog.open(CreateFaqComponent, {
			width: '470px',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getAllFaqs();
		});
	}

	faqEditDialog(faq: any) {
		const dialogRef = this.dialog.open(AddEditFaqComponent, {
			width: '450px',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				info: faq,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getAllFaqs();
		});
	}

	deleteFaqDialog(faq: any) {
		const dialogRef = this.dialog.open(DeleteFaqComponent, {
			width: 'auto',
			height: 'auto',
			data: {
				info: faq,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getAllFaqs();
		});
	}
}
