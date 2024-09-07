import {Component, Inject, OnInit} from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {selectorValue} from 'src/app/models/selector-value';
import {User} from 'src/app/models/User';
import {AccountService} from 'src/app/services/account/account.service';
import {TasksService} from 'src/app/services/tasks/tasks.service';

@Component({
	selector: 'app-add-task',
	templateUrl: './add-task.component.html',
	styleUrls: ['./add-task.component.scss'],
})
export class AddTicketComponent implements OnInit {
	submiting = false;
	user: User;
	userName = '';
	startDate: any;

	operatorSelectorValues!: selectorValue[];

	public taskForm = this.formBuilder.group({
		Title: ['', [Validators.required]],
		StartDate: ['', [Validators.required]],
		EndDate: ['', [Validators.required]],
		CreatedBy: [this.userName],
		AssignedTo: ['', [Validators.required]],
		Comments: [''],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<any>,
		private snackBar: MatSnackBar,
		private userService: AccountService,
		private taskService: TasksService
	) {
		this.user = this.userService.userValue;
		this.userName = `${this.user.firstName} ${this.user.lastName}`;
		this.form.CreatedBy.setValue(this.userName);
	}

	ngOnInit(): void {
		this.taskService.getSelectorValues().subscribe({
			next: (res: any) => {
				this.operatorSelectorValues = res.Operators;
			},
			error: error => {
				this.errorSnack(error);
			},
		});
		this.startDate = this.data != '' ? this.data : new Date();
		console.log(this.startDate);
		this.form.StartDate.setValue(this.startDate);
	}

	get form() {
		return this.taskForm.controls;
	}

	onSubmit() {
		//create task
		this.submiting = true;
		if (this.taskForm.invalid) {
			this.submiting = false;
			return;
		}

		this.taskService.addTask(this.taskForm.value).subscribe({
			next: value => {
				this.submiting = false;
				this.successSnack();
				this.cancel();
			},
			error: err => {
				this.submiting = false;
				this.errorSnack(err);
			},
		});
	}

	cancel() {
		this.dialogRef.close();
	}

	startChange(event: any) {
		this.form.StartDate.setValue(event.value);
	}

	endChange(event: any) {
		this.form.EndDate.setValue(event.value);
	}

	successSnack() {
		this.snackBar.open('Creación de tarea exitosa.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	errorSnack(txt: any) {
		this.snackBar.open(`Error: ${txt}`, '', {
			duration: 3500,
			verticalPosition: 'top',
			/* horizontalPosition: 'center', */
			panelClass: ['background-snack-red'],
		});
	}
}
