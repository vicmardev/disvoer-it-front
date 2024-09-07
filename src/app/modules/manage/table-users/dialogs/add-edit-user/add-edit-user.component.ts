import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {AuthService} from 'src/app/auth/auth.service';
import {MustMatch} from 'src/app/helpers';
import {Role} from 'src/app/models/role';
import {User} from 'src/app/models/User';
import {AccountService} from 'src/app/services/account/account.service';

interface Select {
	value: string;
	viewValue: string;
}

@Component({
	selector: 'app-add-edit-user',
	templateUrl: './add-edit-user.component.html',
	styleUrls: ['./add-edit-user.component.scss'],
})
export class AddEditUserComponent implements OnInit {
	userForm!: FormGroup;
	id: string = '';
	isAddMode!: boolean;
	loading: boolean = false;
	submitted: boolean = false;
	hide = true;
	hideConfirm = true;

	Roles: Select[] = [
		{value: 'Admin', viewValue: 'Admin'},
		{value: 'User', viewValue: 'User'},
	];

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private accountService: AccountService //alerts
	) {}

	ngOnInit(): void {
		this.id = this.route.snapshot.params['id'];
		//see if user id is given, go into add mode if user does not exist
		this.isAddMode = this.id ? false : true;

		this.userForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			role: ['', Validators.required],
			contrato: ['', Validators.required],
			password: [
				'',
				[
					Validators.minLength(6),
					this.isAddMode ? Validators.required : Validators.nullValidator,
				],
			],
			confirmPassword: [''],
		});
		//set user values in form if editing
		if (!this.isAddMode) {
			this.accountService
				.getById(this.id)
				.pipe(first())
				.subscribe(x => {
					this.userForm.patchValue(x);
				});
		}
	}

	get form() {
		return this.userForm.controls;
	}

	onSubmit() {
		this.submitted = true;
		//reset alerts

		//stop if form invalid
		if (this.userForm.invalid) {
			return;
		}

		this.loading = true;

		if (this.isAddMode) {
			//create user

			this.createUser();
		} else {
			//update user
			this.updateUser();
		}
	}

	private createUser() {
		this.accountService
			.create(this.userForm.value)
			.pipe(first())
			.subscribe({
				next: () => {
					//alert user is created
					this.router.navigate(['../'], {relativeTo: this.route});
				},
				error: error => {
					//alert error

					this.loading = false;
				},
			});
	}
	returnAdmin() {
		this.router.navigate(['../'], {relativeTo: this.route});
	}

	private updateUser() {
		this.accountService
			.update(this.id, this.userForm.value)
			.pipe(first())
			.subscribe({
				next: () => {
					//alert update user
					//navigate to user list
					this.router.navigate(['../../'], {relativeTo: this.route});
				},
				error: error => {
					//alert error
					this.loading = false;
				},
			});
	}
}
