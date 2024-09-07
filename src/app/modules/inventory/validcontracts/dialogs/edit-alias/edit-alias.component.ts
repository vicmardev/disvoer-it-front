import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {IContract} from 'src/app/models/IContract';
import {InventoryService} from 'src/app/services/inventory/inventory.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ContractsService} from 'src/app/services/contracts/contracts.service';
import {IQueryResult} from 'src/app/models/IQueryResult';

@Component({
	selector: 'app-edit-alias',
	templateUrl: './edit-alias.component.html',
	styleUrls: ['./edit-alias.component.scss'],
})
export class EditAliasComponent implements OnInit {
	public formEditAlias = this.formBuilder.group({
		Alias: [this.contract.Alias],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public contract: IContract,
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<any>,
		private contractsService: ContractsService,
		private snackBar: MatSnackBar
	) {}

	ngOnInit(): void {}

	cancel() {
		this.dialogRef.close();
	}

	update() {
		this.contractsService
			.editAlias(this.contract.IdContract, this.formEditAlias.value)
			.subscribe((result: IQueryResult) => {
				if (!result.status) {
					this.errorExit(result.msg);
				}

				// Update the view to reflect the changes
				Object.assign(this.contract, this.formEditAlias.value);
				const msg = 'Actualización de datos exitosa';
				this.showSnackbar(msg);
				this.cancel();
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
