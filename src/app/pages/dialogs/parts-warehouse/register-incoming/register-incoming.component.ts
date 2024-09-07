import {NONE_TYPE} from '@angular/compiler';
import {Component, Inject, OnInit, Input} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {selectorValue} from 'src/app/models/selector-value';
import {PartsComponent} from 'src/app/pages/parts-werehouse/parts/parts.component';
import {AccountService} from 'src/app/services/account/account.service';
import {PartsWerehouseService} from 'src/app/services/partsWerehouse/parts-werehouse.service';
import {NewPartComponent} from '../new-part/new-part.component';

@Component({
	selector: 'app-register-incoming',
	templateUrl: './register-incoming.component.html',
	styleUrls: ['./register-incoming.component.scss'],
})
export class RegisterIncomingComponent implements OnInit {
	qrInfo: any = undefined;
	useQR = false;
	partTypeSelectorValues!: selectorValue[];
	storeSelectorValues!: selectorValue[];

	qrCodeData: any;

	userName =
		this.userService.userValue.firstName + ' ' + this.userService.userValue.lastName;

	incomingOpPartForm = this._formBuilder.group({
		SerialNumber: ['', [Validators.required]],
		Available: [true],
		DateEntry: [new Date()],
		UserEntry: [this.userName],
		NumInvoiceEntry: [-1],
	});

	outgoingOpPartForm = this._formBuilder.group({
		IdTicket: ['', [Validators.required]],
		SerialNumber: ['', [Validators.required]],
		Available: [false],
		DateExit: [new Date()],
		UserExit: [this.userName],
		NumInvoiceExit: [-1],
	});

	public logEquipmentForm = this._formBuilder.group({
		IdPart: [''], // check if id is included, if not find part by part number
		TypePart: ['', [Validators.required]],
		Brand: ['', [Validators.required]],
		Model: ['', [Validators.required]],
		PartNumber: ['', [Validators.required]],
		OperationPart:
			this.data.info == 'incoming' ? this.incomingOpPartForm : this.outgoingOpPartForm,
		Rack: this._formBuilder.group({
			IdStore: ['', [Validators.required]],
			NameRack: ['', [Validators.required]],
			Column: ['', [Validators.required]],
			Row: ['', [Validators.required]],
		}),
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _formBuilder: FormBuilder,
		private _snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<any>,
		private userService: AccountService,
		private dialog: MatDialog,
		private partWareHouseService: PartsWerehouseService
	) {}

	ngOnInit(): void {
		this.partWareHouseService.getPartField().subscribe((res: any) => {
			this.partTypeSelectorValues = res;
		});

		this.partWareHouseService.getPartField('store').subscribe((res: any) => {
			this.storeSelectorValues = res;
		});
	}

	onCodeResult(event: any) {
		this.qrInfo = event;
		console.log(event);
		const rack = event.OperationParts ? event.OperationParts[0].Rack : undefined;
		const equipmentObject = {
			IdPart: event.IdPart ? event.IdPart : null,
			PartNumber: event.PartNumber ? event.PartNumber : null,
			TypePart: event.TypePart ? event.TypePart : null,
			Brand: event.Brand ? event.Brand : null,
			Model: event.Model ? event.Model : null,
			OperationPart: {
				SerialNumber: event.OperationParts
					? event.OperationParts[0].SerialNumber
					: event.SerialNumber
					? event.SerialNumber
					: '',
			},
			Rack: {
				IdStore: rack ? rack.IdStore : '',
				NameRack: rack ? rack.NameRack : '',
				Column: rack ? rack.Column : '',
				Row: rack ? rack.Row : '',
			},
		};

		this.logEquipmentForm.patchValue(equipmentObject);
	}

	createNewEquipt() {
		this.partWareHouseService
			.createOperationPart(this.logEquipmentForm.value)
			.subscribe(res => {
				if (res == undefined) {
					this.openNewPartDialog();
				} else {
					// this.closeDialog();
					let part = res;
					this.qrCodeData = JSON.stringify(part);
				}
			});
	}

	openNewPartDialog() {
		const dialogRef = this.dialog.open(NewPartComponent, {
			width: '40rem',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: this.logEquipmentForm.value,
		});

		dialogRef.afterClosed().subscribe(res => {
			const partChanges = res;
			this.logEquipmentForm.patchValue(partChanges);
		});
	}

	closeSnack() {
		const transactionMessage = this.data.info == 'incoming' ? 'Registro' : 'Retiro';
		this._snackBar.open(`${transactionMessage} de parte exitoso.`, '', {
			duration: 3500,
			verticalPosition: 'top',
			/* horizontalPosition: 'center', */
			panelClass: ['background-snack'],
		});
	}
	closeDialog() {
		this.dialogRef.close();
	}
}
