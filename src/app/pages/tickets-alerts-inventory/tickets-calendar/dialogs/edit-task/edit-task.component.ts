import {Component, Inject, OnInit} from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {selectorValue} from 'src/app/models/selector-value';
import {User} from 'src/app/models/User';
import {AccountService} from 'src/app/services/account/account.service';
import {TasksService} from 'src/app/services/tasks/tasks.service';

@Component({
	selector: 'app-edit-task',
	templateUrl: './edit-task.component.html',
	styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
	submiting = false;
	user: User;
	userName = '';
	operatorSelectorValues!: selectorValue[];
	taskId!: number;

	public taskForm = this.formBuilder.group({
		Title: ['', [Validators.required]],
		StartDate: ['', [Validators.required]],
		EndDate: ['', [Validators.required]],
		CreatedBy: [this.userName],
		AssignedTo: ['', [Validators.required]],
		Comments: [''],
		IdTask: [''],
		UpdatedBy: [''],
		CreationDate: [''],
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
		this.taskId = this.data.task;
		this.getTaskData(this.taskId);
	}

	get form() {
		return this.taskForm.controls;
	}

	getTaskData(id: number) {
		this.taskService.getById(id).subscribe({
			next: (res: any) => {
				const task = res;
				this.taskForm.setValue(task);
				this.form.UpdatedBy.setValue(this.userName);

				console.log(this.taskForm.value);
			},
			error: error => {
				this.errorSnack(error);
			},
		});
	}

	onSubmit() {
		//create task
		this.submiting = true;
		if (this.taskForm.invalid) {
			this.submiting = false;
			return;
		}

		this.taskService.updateTask(this.taskId, this.taskForm.value).subscribe({
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
