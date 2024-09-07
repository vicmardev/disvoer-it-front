import {Component, OnInit} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatIconRegistry} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomSanitizer} from '@angular/platform-browser';
import {Chassis} from 'src/app/models/chassis';
import {DiscoveryService} from 'src/app/services/discovery/discovery.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-device-discovery',
	templateUrl: './device-discovery.component.html',
	styleUrls: ['./device-discovery.component.scss'],
})
export class DeviceDiscoveryComponent implements OnInit {
	btn = false;
	icons: any[] = [];
	loading = false;
	showTable = false;
	discoveryForm: FormGroup;

	tableData: Chassis[] = [];
	constructor(
		private discoveryService: DiscoveryService,
		private formBuilder: FormBuilder,
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer,
		private snackBar: MatSnackBar
	) {
		this.discoveryForm = this.formBuilder.group({
			ip: ['', Validators.required],
			user: ['', Validators.required],
			password: ['', Validators.required],
			password_enable: ['', Validators.required],
			type: ['', Validators.required],
			driver: ['ios'],
		});

		this.registerIcons();
	}

	get form() {
		return this.discoveryForm.controls;
	}

	ngOnInit(): void {
		this.getchips();
	}

	registerIcons() {
		this.iconRegistry.addSvgIcon(
			'ip-icon',
			this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/IP.svg')
		);
		this.iconRegistry.addSvgIcon(
			'user-icon',
			this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/User.svg')
		);
		this.iconRegistry.addSvgIcon(
			'password-icon',
			this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/Lock.svg')
		);
	}

	getchips() {
		this.discoveryService.getTypePartsName().subscribe((res: any) => {
			//res.data hold our type names
			this.getTypeIcons(res.data);
		});
	}

	getTypeIcons(typesName: any) {
		for (const type of typesName) {
			let name = type.Name;
			name = name.toLowerCase();
			name = name.replace(/\s/g, '');

			this.icons.push({
				value: type.Name.toLowerCase(),
				name: type.Name,
				icon: `assets/icons/${name}.svg`,
			});
		}
	}

	selectChip(type: any) {
		this.discoveryForm.controls['type'].setValue(type.value);
		this.discoveryForm.controls['password_enable'].setValue(
			this.discoveryForm.controls['password'].value
		);
	}

	changeButtonView() {
		this.loading = true;
		Swal.fire({
			customClass: 'swal-height',
			width: 0,
			showConfirmButton: false,
			backdrop: `
						rgba(221,241,249,0.4)
						url("/assets/gifs/Antena-1-unscreen.gif")
						center
						no-repeat
					`,
		});
	}

	getChasis() {
		this.changeButtonView();
		this.form.password_enable.setValue(this.form.password.value);
		this.discoveryService.getChasis(this.discoveryForm.value).subscribe({
			next: res => {
				this.showTable = true;
				this.btn = true;

				const data: any = res;
				this.tableData.push(data);
				//copy array to force child component to detect change
				this.tableData = this.tableData.slice();

				Swal.close();
			},
			error: () => {
				this.errorMessage();
				Swal.close();
			},
		});
		// this.CHASIS = [res];
	}

	errorMessage() {
		this.snackBar.open('No se logro obtener información del dispositivo.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-red'],
		});
	}
}
