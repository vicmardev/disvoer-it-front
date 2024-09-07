import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {int} from '@zxing/library/esm/customTypings';
import {InventoryService} from '../../../../../services/inventory/inventory.service';
import {FormControl, FormBuilder} from '@angular/forms';
import {Data} from '@syncfusion/ej2-angular-grids';

@Component({
	selector: 'app-engineers',
	templateUrl: './engineers.component.html',
	styleUrls: ['./engineers.component.scss'],
})
export class EngineersComponent implements OnInit {
	engineers: any = [];
	availableEngineers: any = [];
	unavailableEngineers: any = [];

	query: any = null;
	statusDelete: any;

	public formEngineers = this._formBuilder.group({
		id: [''],
	});
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _inventoryService: InventoryService,
		private _snackBar: MatSnackBar,
		private _formBuilder: FormBuilder
	) {}

	ngOnInit(): void {
		this.getContractEngineersById();
	}

	getContractEngineersById() {
		this._inventoryService
			.getContractEngineersById(this.data.info.IdContract)
			.subscribe(res => {
				this.engineers = res;
				for (let i = 0; i < this.engineers.length; i++) {
					this.unavailableEngineers.push(this.engineers[i].IdEngineer);
				}
				this.getAvailableEngineers();
			});
	}
	remove(engineer: string): void {
		const index = this.engineers.indexOf(engineer);

		if (index >= 0) {
			this.engineers.splice(index, 1);
		}
	}

	closeDialog() {
		this.dialogRef.close();
	}

	deleteEngineerCE(Engineer: any) {
		const row = {
			IdEngineer: Engineer.IdEngineer,
			IdContract: Engineer.IdContract,
		};
		this._inventoryService.deleteEngineerCE(row).subscribe(res => {
			this.statusDelete = res;
			this.statusDelete.data == 0
				? this._snackBar.open(`${this.statusDelete.data}`, '', {
						duration: 3500,
						verticalPosition: 'top',
						panelClass: ['background-snack-red'],
				  })
				: this._snackBar.open(`Se borró a ${Engineer.Name} del contrato.`, '', {
						duration: 3500,
						verticalPosition: 'top',
						panelClass: ['background-snack'],
				  });
			this.getAvailableEngineers();
		});
	}

	getAvailableEngineers() {
		this._inventoryService
			.getAvailableEngineers(this.unavailableEngineers)
			.subscribe(res => {
				this.availableEngineers = res;
				this.availableEngineers = this.availableEngineers.data;
			});
	}

	addEngineer() {
		for (let i = 0; i < this.formEngineers.value.id.length; i++) {
			const data = {
				IdContract: this.data.info.IdContract,
				IdEngineer: this.formEngineers.value.id[i],
			};
			this._inventoryService.setContractEngineers(data).subscribe(res => {
				this.query = res;
				this.query.data != null
					? this._snackBar.open('Contrato actualizado correctamente .', '', {
							duration: 3500,
							verticalPosition: 'top',
							panelClass: ['background-snack'],
					  })
					: this._snackBar.open(`No se pudo actualizar el contrato.`, '', {
							duration: 3500,
							verticalPosition: 'top',
							panelClass: ['background-snack-red'],
					  });
			});
		}
		this.closeDialog();
	}
}
