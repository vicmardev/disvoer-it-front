import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from 'src/app/models/User';
import {ReporProblemService} from 'src/app/services/reportProblem/repor-problem.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
	selector: 'app-report-problem',
	templateUrl: './report-problem.component.html',
	styleUrls: ['./report-problem.component.scss'],
})
export class ReportProblemComponent implements OnInit {
	reportForm!: FormGroup;
	submitted: boolean = false;
	isLoading: boolean = false;
	dynamicVariable = true;
	nameUser!: User;

	get user() {
		this.nameUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as any;
		return this.nameUser;
	}

	constructor(
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<any>,
		private route: ActivatedRoute,
		private router: Router,
		private _snackBar: MatSnackBar,
		private _reportProblemService: ReporProblemService
	) {}

	ngOnInit(): void {
		console.log('Valor de this.user', this.nameUser);
		this.reportForm = this.formBuilder.group({
			description: ['', Validators.required],
			url: ['', Validators.required],
			mail: ['', Validators.required],
			//evidence:['', Validators.required]
		});
	}

	get form() {
		return this.reportForm.controls;
	}

	onSubmit() {
		this.submitted = true;
		if (this.reportForm.invalid) {
			return;
		}
		console.log('El boton de enviar si funciona', this.reportForm.value);

		this.isLoading = true;
		this._reportProblemService.sendEmail(this.reportForm.value).subscribe({
			next: () => {
				this.reportForm.controls['description'].setValue('');
				this.reportForm.controls['url'].setValue('');
				this.reportForm.controls['mail'].setValue('');
				this.successSnack();
				this.closeDialog();
			},
		});
	}

	successSnack() {
		this._snackBar.open(`Correo enviado a soporte`, '', {
			duration: 3500,
			verticalPosition: 'top',
			/* horizontalPosition: 'center', */
			panelClass: ['background-snack-info'],
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
