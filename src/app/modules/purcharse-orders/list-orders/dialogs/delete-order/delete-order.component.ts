import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OrderPurchaseService} from 'src/app/services/orderPurchase/order-purchase.service';
import {AccountService} from 'src/app/services/account/account.service';

@Component({
	selector: 'app-delete-order',
	templateUrl: './delete-order.component.html',
	styleUrls: ['./delete-order.component.scss'],
})
export class DeleteOrderComponent implements OnInit {
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private orderService: OrderPurchaseService,
		private snackBar: MatSnackBar,
		private accountService: AccountService
	) {}

	ngOnInit(): void {
		this.data.IdOrder;
	}

	deleteOrder() {
		console.log('La orden seleccionada: ', this.data.info.IdOrder);
		this.orderService.deleteOrder(this.data.info).subscribe(res => {
			this.snackMessageOk('Orden eliminada');
			this.closeDialog();
		});
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
