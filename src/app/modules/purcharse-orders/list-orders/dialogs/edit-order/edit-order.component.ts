import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormControl, Validators, FormGroup} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OrderPurchaseService} from 'src/app/services/orderPurchase/order-purchase.service';
import {AccountService} from 'src/app/services/account/account.service';

@Component({
	selector: 'app-edit-order',
	templateUrl: './edit-order.component.html',
	styleUrls: ['./edit-order.component.scss'],
})
export class EditOrderComponent implements OnInit {
	updatewForm!: FormGroup;
	statusList: any;
	historyList: any;
	clientList: any;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private formBuilder: FormBuilder,
		private orderService: OrderPurchaseService,
		private snackBar: MatSnackBar,
		private _accountService: AccountService
	) {}

	ngOnInit(): void {
		this.updatewForm = this.formBuilder.group({
			IdOrder: [this.data.info.IdOrder, [Validators.required]],
			IdClient: [this.data.info.ClientName, [Validators.required]],
			NumOrden: [this.data.info.NumOrder, [Validators.required]],
			DateReceptionEmail: [this.data.info.DateReceptionEmail, [Validators.required]],
			IdStatus: [this.data.info.IdStatus, [Validators.required]],
			User: [this.data.info.User, [Validators.required]],
			UserClient: [this.data.info.UserClient, [Validators.required]],
			UrlOrderFile: [this.data.info.UrlOrderFile, [Validators.required]],
			Comments: [this.data.info.Comments, [Validators.required]],
			EmailUserFinal: [this.data.info.EmailUserFinal, [Validators.required]],
			OwnCompany: [this.data.info.OwnerCompany, [Validators.required]],
			IdBrand: [this.data.info.Brand, [Validators.required]],
			IdTypeEquipments: [this.data.info.TypePart, [Validators.required]],
			TotalEquipments: [this.data.info.TotalEquipments, [Validators.required]],
			Services: [this.data.info.Services, [Validators.required]],
			NoProvider: [this.data.info.ClientName, [Validators.required]],
			Subtotal: [this.data.info.Subtotal, [Validators.required]],
		});
		this.orderService.getStatusList('OrderPurchase').subscribe(result => {
			this.statusList = result;
		});
		this.orderService.getHistory(this.data.info.NumOrden).subscribe(result => {
			this.historyList = result;
		});
		this.orderService.getClientsList().subscribe(result => {
			this.clientList = result;
		})
	}

	updateOrder() {
		this.orderService.updateOrder(this.updatewForm.value).subscribe(res => {
			this.snackMessageOk('Orden Actualizada');
			this.closeDialog();
		});
	}

	fileUpload(event: any) {
		let file: any = event.target.files[0];
		if (file) {
			if (file.type == 'application/pdf') {
				console.log('Se cargo el archivo');
				const reader = new FileReader();
				reader.onload = () => {
					//this.file = reader.result as string;
				};
				reader.readAsDataURL(file);
				//this.createForm.patchValue({UrlOrderFile: file});
			} else {
				//this.snackBarMessage('Archivo no permitido, solo PDF');
			}
		}
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
