import {ChangeDetectorRef, ElementRef, ViewChild, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from 'src/app/auth/auth.service';
import {MustMatch} from 'src/app/helpers';
import {Role} from 'src/app/models/role';
import {User} from 'src/app/models/User';
import {AccountService} from 'src/app/services/account/account.service';
import {environment} from 'src/environments/environment';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ChangePhotoComponent} from 'src/app/pages/dialogs/change-photo/change-photo.component';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
	Role = Role;
	user!: User;
	nameUser!: User;
	rol: any = '';
	isAddModel!: boolean;
	AvatarImgUrl = `${environment.ticketImgUrl}/`;
	updateForm!: FormGroup;
	loading: boolean = false;
	hide: boolean = true;
	hideConfirm: boolean = true;
	submitted: boolean = false;
	check: boolean = false;
	editFile: boolean = true;
	removeUpload: boolean = false;
	//TODO: load this url from current usr if avalaibel

	imgUrl: string = '';

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private cd: ChangeDetectorRef,
		private dialog: MatDialog,
		public _snackBar: MatSnackBar,
		private accountService: AccountService,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.authService.currentUser.subscribe(x => (this.user = x));
	}

	ngOnInit(): void {
		this.nameUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as any;
		this.imgUrl =
			this.nameUser.role == 'User'
				? 'https://amzucapacitacion.com/wp-content/uploads/2021/06/avatar-4.png'
				: 'https://cdn1.iconfinder.com/data/icons/people-49/512/_nerd_man-512.png';
		this.updateForm = this.formBuilder.group({
			firstName: [this.user.firstName, Validators.required],
			lastName: [this.user.lastName, Validators.required],
			email: [this.user.email, [Validators.required, Validators.email]],
			fileUpload: [''],
			accept: [''],
			password: [
				'',
				[
					Validators.minLength(6),
					this.isAddModel ? Validators.required : Validators.nullValidator,
				],
			],
			confirmPassword: [''],
			Validators: MustMatch('password', 'confirmPassword'),
		});

		if (!this.isAddModel) {
			this.accountService
				.getById(this.user.id)
				.pipe(first())
				.subscribe((x: any) => {
					this.updateForm.patchValue(x);
				});
		}
		this.check = false;
		this.updateForm.disable();
		//this.validateCheck();
	}

	validateCheck() {
		console.log(this.check);
		if (this.check == true) {
			this.updateForm.enable();
		} else if (this.check == false) {
			this.updateForm.disable();
		}
	}

	openDialog() {
		const dialogRef = this.dialog.open(ChangePhotoComponent, {
			width: 'auto',
			height: 'auo',
			autoFocus: false,
			maxHeight: '90vh',
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log('Test');
		});
	}

	updateUser() {
		this.accountService
			.update(this.user.id, this.updateForm.value)
			.pipe(first())
			.subscribe({
				next: () => {
					window.location.reload();
					this.router.navigate(['../../'], {relativeTo: this.route});
				},
				error: error => {
					this.loading = false;
				},
			});
		this._snackBar.open(`Cambios  Guardados de manera exitosa.`, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-info'],
		});

		/* window.location.reload(); */
	}

	get form() {
		return this.updateForm.controls;
	}

	onSubmit() {
		//boton funcionando
		this.submitted = true;

		if (this.updateForm.invalid) {
			return;
		}

		this.loading = true;

		if (this.isAddModel) {
			//create user

			this.createUser();
		} else {
			//update user
			this.updateUser();
		}
	}

	createUser() {
		throw new Error('Method not implemented.');
	}

	changeFile(result: any) {
		this.imgUrl = result.data;
		this.editFile = false;
		this.removeUpload = true;
		const imageName = 'profile.png';
		const imageBlob = this.convertB64ToBlob(result.data);
		const imageFile = new File([imageBlob], imageName, {type: 'image/png'});
		this.updateForm.patchValue({
			fileUpload: imageFile,
		});
		return imageFile;
	}

	private convertB64ToBlob(base64Image: string) {
		const parts = base64Image.split(';base64,');
		const imageType = parts[0].split(':')[1];
		const decodedData = window.atob(parts[1]);
		const array = new Uint8Array(decodedData.length);
		for (let i = 0; i < decodedData.length; i++) {
			array[i] = decodedData.charCodeAt(i);
		}
		return new Blob([array], {type: imageType});
	}
}
