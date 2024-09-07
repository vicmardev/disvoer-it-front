import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {first} from 'rxjs/operators';
import {InventoryService} from 'src/app/services/inventory/inventory.service';
import {environment} from 'src/environments/environment';

type ExcelErrors = {
	error: boolean;
	list?: Object;
};

@Component({
	selector: 'app-update-file',
	templateUrl: './update-file.component.html',
	styleUrls: ['./update-file.component.scss'],
})
export class UpdateFileComponent implements OnInit {
	file: any;
	fileToUpload: any;
	token: string = 'Z^M%pK2R8Xg&ZJhY';
	hideToken = true;
	flagSpiner: boolean = false;
	fileVerified: boolean = false;
	@ViewChild('fileInput') fileInput!: ElementRef;
	itemsChanged: number = 0;
	newItems: number = 0;

	constructor(
		private inventoryService: InventoryService,
		public http: HttpClient,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<any>
	) {}

	ngOnInit(): void {}

	onFileChange(event: any) {
		if (event.target.files.length > 0) {
			let file = event.target.files[0];
			this.fileToUpload = file;
		}
	}

	checkContracts() {
		this.flagSpiner = true;
		this.inventoryService.checkContracts(this.fileToUpload, this.token).subscribe(res => {
			if (res.data.valid) {
				this.itemsChanged = res.data.updatedRows;
				this.newItems = res.data.newRows;
				this.flagSpiner = false;
				this.fileVerified = true;
			} else {
				if ('error' in res.data) {
					this.closeDialog();
					this.errorSnack(res.data.error);
				} else {
					this.closeDialogWithExelErrrors(true, res.data.excelErrors);
				}
			}
		});
	}

	addContracts() {
		/*
		this.flagSpiner = true;
		if (this.fileVerified) {
			this.inventoryService.addContracts(this.fileToUpload, this.token).subscribe(res => {
				console.log(res);
				if (res.data.status === 'success') {
					this.closeDialog();
					this.closeSnack(this.itemsChanged, this.newItems);
				} else {
					if ('error' in res.data) {
						this.closeDialog();
						this.errorSnack(res.data.error);
					} else {
						this.closeDialogWithExelErrrors(true, res.data.excelErrors);
					}
				}
			});
		} else {
			this.closeDialog();
			this.closeSnack(this.itemsChanged, this.newItems);
		}
    */
	}

	closeDialog() {
		this.flagSpiner = false;
		this.dialogRef.close({showErrors: false, excelErrors: {} as ExcelErrors});
	}

	closeDialogWithExelErrrors(showErrors: boolean, excelErrors: ExcelErrors) {
		this.flagSpiner = false;
		this.dialogRef.close({showErrors: showErrors, excelErrors: excelErrors});
	}

	closeSnack(numUpdated: any, numNew: any) {
		this._snackBar.open(`${numUpdated} modificados y ${numNew} nuevos.`, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	errorSnack(error: string) {
		this._snackBar.open(error, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}
}
