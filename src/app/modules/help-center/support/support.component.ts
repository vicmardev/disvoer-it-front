import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from 'src/app/models/User';
import {HelpCenterService} from 'src/app/services/helpCenter/help-center.service';
import {environment} from 'src/environments/environment';

@Component({
	selector: 'app-support',
	templateUrl: './support.component.html',
	styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
	contactForm!: FormGroup;
	submited: boolean = false;
	isLoading: boolean = false;
	dynamicVariable = true;
	nameUser!: User;
	imgUrl: String = '';
	AvatarImgUrl = `${environment.ticketImgUrl}/`;

	get user() {
		this.nameUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as any;
		return this.nameUser;
	}

	constructor(
		private formBuilder: FormBuilder,
		private _support: HelpCenterService,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.imgUrl =
			this.user.role == 'User'
				? 'https://amzucapacitacion.com/wp-content/uploads/2021/06/avatar-4.png'
				: 'https://cdn1.iconfinder.com/data/icons/people-49/512/_nerd_man-512.png';
		this.contactForm = this.formBuilder.group({
			firstName: this.nameUser.firstName,
			company: ['', Validators.required],
			phone: ['', Validators.required],
			email: this.nameUser.email,
			message: ['', Validators.required],
		});
	}

	get form() {
		return this.contactForm.controls;
	}

	onSubmit() {
		this.submited = true;
		if (this.contactForm.invalid) {
			return;
		}
		this.isLoading = true;
		this._support.sendEmail(this.contactForm.value).subscribe({
			next: () => {
				this.contactForm.controls['company'].setValue('');
				this.contactForm.controls['phone'].setValue('');
				this.contactForm.controls['message'].setValue('');
				this.successSnack();
			},
		});
	}

	successSnack() {
		this._snackBar.open(`Correo enviado a soporte`, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-info'],
		});
	}
}
