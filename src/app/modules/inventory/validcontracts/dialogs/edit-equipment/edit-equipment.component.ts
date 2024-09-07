import {Component, Inject, OnInit} from '@angular/core';
import {InventoryService} from 'src/app/services/inventory/inventory.service';
import {FormBuilder} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ContractsService} from 'src/app/services/contracts/contracts.service';

@Component({
	selector: 'app-edit-equipment',
	templateUrl: './edit-equipment.component.html',
	styleUrls: ['./edit-equipment.component.scss'],
})
export class EditEquipmentComponent implements OnInit {
	public formEditEquipmentRow = this.formBuilder.group({
		ServiceTag: [''],
		IP: [''],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private contractService: ContractsService,
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<any>,
		private snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.getValuesFrom();
	}

	async getValuesFrom() {
		this.formEditEquipmentRow.controls['IP'].setValue(
			this.data.equipment.DataCenterEquipment.IP
		);

		this.formEditEquipmentRow.controls['ServiceTag'].setValue(
			this.data.equipment.DataCenterEquipment.ServiceTag
		);
	}

	cancel() {
		this.dialogRef.close();
	}
	update() {
		this.contractService
			.editDataCenterEquipment(
				this.data.equipment.DataCenterEquipment.IdDataCenterEquipment,
				this.formEditEquipmentRow.value
			)
			.subscribe(result => {
				if (!result.status) {
					this.errorExit(result.msg);
				}

				const msg = 'Actualización de datos exitosa';
				this.showSnackbar(msg);
				this.dialogRef.close();
			});
	}

	private errorExit(msg: string) {
		this.showSnackbar(msg, 'error');
		this.dialogRef.close();
		return;
	}

	private showSnackbar(msg: string, type: string = 'message') {
		this.snackBar.open(msg, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: [type === 'message' ? 'background-snack-info' : 'background-snack-red'],
		});
	}
}
