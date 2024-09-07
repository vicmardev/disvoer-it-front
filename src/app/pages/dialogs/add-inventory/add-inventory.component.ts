import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {InventoryService} from 'src/app/services/inventory/inventory.service';
import {HttpClient} from '@angular/common/http';
@Component({
	selector: 'app-add-inventory',
	templateUrl: './add-inventory.component.html',
	styleUrls: ['./add-inventory.component.scss'],
})
export class AddInventoryComponent implements OnInit {
	public formCreateEquip = this._formBuilder.group({
		//Equipmentt Data
		Contrato: ['', [Validators.required]],
		Serial: ['', [Validators.required]],
		SerialProvider: ['', [Validators.required]],
		Brand: ['', [Validators.required]],
		Equipment: ['', [Validators.required]],
		Model: ['', [Validators.required]],
		SLA: ['', [Validators.required]],
		ServiceTag: ['', Validators.required],
		Start: ['', [Validators.required]],
		End: ['', [Validators.required]],
		IP: ['', [Validators.required]],
		//Direccion
		Country: ['', [Validators.required]],
		City: ['', [Validators.required]],
		Delegation: ['', [Validators.required]],
		PostalCode: ['', [Validators.required]],
		Street: ['', [Validators.required]],
		InternalNumber: [''],
		ExternalNumber: ['', [Validators.required]],
		Neighborhood: ['', [Validators.required]],
	});

	idContrato: any;
	statusList: any;
	completeAddress: any;
	//http: any;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _formBuilder: FormBuilder,
		private _invetaryService: InventoryService,
		private _snackBar: MatSnackBar,
		private _http: HttpClient
	) {}

	ngOnInit(): void {
		const section = 'Inventory';
		this._invetaryService.getStatusLis(section).subscribe(res => {
			this.statusList = res;
			console.log('El valor de status es: ', this.statusList);
		});
	}

	createNewEquipt() {
		this.formCreateEquip.value;
		console.warn('Valor del formulario', this.formCreateEquip.value);
		this._invetaryService
			.createRowEquipment(this.formCreateEquip.value)
			.subscribe(res => {});
		this.closeSnack();
		this.dialogRef.close();
	}

	updateRow() {
		let id = this.data.info.id;
		this._invetaryService
			.updateRowId(id, this.formCreateEquip.value)
			.subscribe(res => {});
		this.closeSnack();
		this.dialogRef.close();
	}

	getAddressByPC() {
		console.warn('Valor del campo: ', this.formCreateEquip.value.PostalCode);
		let cp = this.formCreateEquip.value.PostalCode;
		this._invetaryService.getAddressByCp(cp).subscribe(res => {
			console.log('El valor de res es: ', res);
			this.completeAddress = res;
		});
	}

	closeSnack() {
		this._snackBar.open('Creación de equipo exitoso.', '', {
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
