import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ReportProblemComponent} from './dialogs/report-problem/report-problem.component';
import {TermsConditionsComponent} from './dialogs/terms-conditions/terms-conditions.component';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
	constructor(private dialog: MatDialog) {}

	ngOnInit(): void {}

	reportProblem() {
		const dialogRef = this.dialog.open(ReportProblemComponent, {
			width: '500px',
			height: 'auto',
			autoFocus: 'false',
			maxHeight: '90vh',
		});
	}

	termsConditions() {
		const dialogRef = this.dialog.open(TermsConditionsComponent, {
			width: '950px',
			height: 'auto',
			autoFocus: 'false',
			maxHeight: '90vh',
		});
	}
}
