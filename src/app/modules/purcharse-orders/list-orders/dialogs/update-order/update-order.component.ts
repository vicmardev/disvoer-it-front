import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormControl, Validators, FormGroup} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OrderPurchaseService} from 'src/app/services/orderPurchase/order-purchase.service';
import {AccountService} from 'src/app/services/account/account.service';
interface Service {
	value: string;
	viewValue: string;
}

interface Company {
	value: Number;
	viewValue: string;
}

@Component({
	selector: 'app-update-order',
	templateUrl: './update-order.component.html',
	styleUrls: ['./update-order.component.scss'],
})
export class UpdateOrderComponent implements OnInit {
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
	updatewForm!: FormGroup;
	statusList: any;
	historyList: any;
	brandsList: any;
	clientList: any;
	typePartsList: any;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private formBuilder: FormBuilder,
		private orderService: OrderPurchaseService,
		private snackBar: MatSnackBar,
		private _accountService: AccountService
	) {}

	ngOnInit(): void {
		console.log('Valor de data: ', this.data);

		this.updatewForm = this.formBuilder.group({
			IdOrder: [this.data.info.IdOrder, [Validators.required]],
			//IdClient: [this.data.info.ClientName, [Validators.required]],
			NumOrden: [this.data.info.NumOrder, [Validators.required]],
			DateReceptionEmail: [this.data.info.DateReceptionEmail, [Validators.required]],
			IdStatus: ['', [Validators.required]],
			User: [this.data.info.User, [Validators.required]],
			UserClient: [this.data.info.UserClient, [Validators.required]],
			UrlOrderFile: [this.data.info.UrlOrderFile, [Validators.required]],
			Comments: [this.data.info.Comments, [Validators.required]],
			EmailUserFinal: [this.data.info.EmailUserFinal, [Validators.required]],
			OwnCompany: [this.data.info.IdOwnerCompany, [Validators.required]],
			IdBrand: [this.data.info.IdBrand, [Validators.required]],
			IdTypeEquipments: [this.data.info.IdTypePart, [Validators.required]],
			TotalEquipments: [this.data.info.TotalEquipments, [Validators.required]],
			Services: [this.data.info.Services, [Validators.required]],
			NoProvider: [this.data.info.ClientName, [Validators.required]],
			Subtotal: [this.data.info.Subtotal, [Validators.required]],
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

	updateOrder() {
		this.orderService.editOrder(this.updatewForm.value).subscribe(res => {
			this.snackMessageOk('Orden Actualizada');
			this.closeDialog();
		});
	}

	numericOnly(event: any): boolean {
		let patt = /^([0-9])$/;
		let result = patt.test(event.key);
		return result;
	}

	closeDialog() {
		this.dialogRef.close();
	}

	snackMessageOk(msg: any) {
		this.snackBar.open(msg, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack-info'],
		});
	}
}
