import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AccountService} from 'src/app/services/account/account.service';

@Component({
	selector: 'app-add-contracts',
	templateUrl: './add-contracts.component.html',
	styleUrls: ['./add-contracts.component.scss'],
})
export class AddContractsComponent implements OnInit {
	arrayUser: any = [];
	newContract: any = '';
	statusContract: any;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>,
		private _snackBar: MatSnackBar,
		private _accountService: AccountService
	) {}

	ngOnInit(): void {
		this.arrayUser = this.data;
	}

	addContract(contract: string) {
		const email = this.arrayUser.email;
		let contracts = contract.trim();
		// this.arrayUser.contrato.push(contract);
		this.newContract = '';
		this._accountService.updateListContract(email, contracts).subscribe(res => {
			this.statusContract = res;
			if (this.statusContract.status === true) {
				this._snackBar.open('Este  contrato ya existe', '', {
					duration: 3500,
					verticalPosition: 'top',
					/* horizontalPosition: 'center', */
					panelClass: ['background-snack-red'],
				});
				this.newContract = '';
			} else {
				this.arrayUser.contrato.push(contract);
				this.newContract = '';
				//  window.location.reload();
			}
		});
	}

	delete(contract: string, indice: number) {
		const email = this.arrayUser.email;
		this._accountService.deleteContractUser(email, contract).subscribe(res => {
			this._snackBar.open('Eliminado Correctamente', '', {
				duration: 3500,
				verticalPosition: 'top',
				/* horizontalPosition: 'center', */
				panelClass: ['background-snack-red'],
			});

			this.arrayUser.contrato.splice(indice, 1);
		});
	}

	saveContratcts(listContracts: any) {
		const email = this.arrayUser.email;

		this._accountService.updateListContract(email, listContracts).subscribe(res => {});
		/* this.dialogRef.close();
    this._snackBar.open('Actualización de  contratos  exitosa.', '', {
      duration: 1000,
      panelClass: ['background-snack'],
    }); */
	}
}
