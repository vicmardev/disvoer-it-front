import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from 'src/app/services/account/account.service';
import {AuthService} from 'src/app/auth/auth.service';
import {OrderPurchaseService} from 'src/app/services/orderPurchase/order-purchase.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
//import {ListOrdersComponent} from '../../list-orders/list-orders.component';
import {User} from 'src/app/models/User';
//import{AccountService}
interface Service {
	value: string;
	viewValue: string;
}

interface Company {
	value: Number;
	viewValue: string;
}

@Component({
	selector: 'app-create-order',
	templateUrl: './create-order.component.html',
	styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
	services: Service[] = [
		{
			value: 'Activación de servicio de soporte',
			viewValue: 'Activación de servicio de soporte',
		},
		{
			value: 'Recepción de equipamiento',
			viewValue: 'Compra equipo Recepción de equipamiento',
		},
	];
	companies: Company[] = [
		{
			value: 1,
			viewValue: 'Alpha',
		},
		{value: 2, viewValue: 'Virwo'},
	];
	createForm!: FormGroup;
	statusList: any;
	brandsList: any;
	clientList: any;
	typePartsList: any;
	file: any;
	isDisabled: boolean = false;
	nameUser!: User;
	get user() {
		this.nameUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as any;
		console.log('This name user', this.nameUser);

		return this.nameUser;
	}

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private orderService: OrderPurchaseService,
		private snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<any>, //private listOrder: ListOrdersComponent //
		private _accountService: AccountService
	) {}
	get form() {
		return this.createForm.controls;
	}

	ngOnInit(): void {
		this.createForm = this.formBuilder.group({
			NumOrden: ['', [Validators.required]],
			DateReceptionEmail: ['', [Validators.required]],
			//IdStatus: ['', [Validators.required]],
			User: this._accountService.userValue.email,
			UserClient: ['', [Validators.required]],
			UrlOrderFile: ['', [Validators.required]],
			Comments: ['', [Validators.required]],
			EmailUserFinal: ['', [Validators.required]],
			OwnCompany: ['', [Validators.required]],
			IdBrand: ['', [Validators.required]],
			IdTypeEquipments: ['', [Validators.required]],
			TotalEquipments: ['', [Validators.required]],
			Services: ['', [Validators.required]],
			NoProvider: ['', [Validators.required]],
			Subtotal: ['', [Validators.required]],
		});
		this.orderService.getStatusList('OrderPurchase').subscribe(result => {
			this.statusList = result;
		});
		this.orderService.getBrandsList().subscribe(result => {
			this.brandsList = result;
		});
		this.orderService.getTypeList().subscribe(result => {
			this.typePartsList = result;
		});
		this.orderService.getClientsList().subscribe(result => {
			this.clientList = result;
		})
	}

	fileUpload(event: any) {
		let file: any = event.target.files[0];
		if (file) {
			if (file.type == 'application/pdf') {
				console.log('Se cargo el archivo');
				const reader = new FileReader();
				reader.onload = () => {
					this.file = reader.result as string;
				};
				reader.readAsDataURL(file);
				this.createForm.patchValue({UrlOrderFile: file});
			} else {
				this.snackBarMessage('Archivo no permitido, solo PDF');
			}
		}
	}

	generateOrder() {
		console.log('Valor de UrlOrderFile: ', this.createForm.value.UrlOrderFile);
		this.orderService
			.createOrder(this.createForm.value, this.createForm.value.UrlOrderFile)
			.subscribe(res => {});
		this.closeDialog();
		this.snackBarMessage('Orden creada');
	}

	closeDialog() {
		this.dialogRef.close();
	}

	snackBarMessage(message: string) {
		this.snackBar.open(`${message}`, '', {
			duration: 5500,
			verticalPosition: 'top',
			panelClass: ['background-snack-info'],
		});

		//window.location.reload();
	}
	numericOnly(event: any): boolean {
		let patt = /^([0-9])$/;
		let result = patt.test(event.key);
		return result;
	}

	snackBarMessageBad(message: string) {
		this.snackBar.open(`${message}`, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-warn'],
		});
	}
}
