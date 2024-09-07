import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PartsWerehouseService} from 'src/app/services/partsWerehouse/parts-werehouse.service';
import {MatSnackBar} from '@angular/material/snack-bar';

type UploadError = {
	error: boolean;
	list?: Object;
};

@Component({
	selector: 'app-upload-file',
	templateUrl: './upload-file.component.html',
	styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements OnInit {
	flagSpiner: boolean = false;
	fileToUpload: any;
	token: string = 'Z^M%pK2R8Xg&ZJhY';
	hideToken: boolean = true;
	fileVerified: boolean = false;
	itemsChanged: number = 0;
	newItems: number = 0;

	constructor(
		private partsWherehouseService: PartsWerehouseService,
		private _snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {}

	onFileChange(event: any) {
		if (event.target.files.length > 0) {
			let file = event.target.files[0];
			this.fileToUpload = file;
		}
	}

	checkParts() {
		this.flagSpiner = true;
		this.partsWherehouseService.checkParts(this.fileToUpload, this.token).subscribe({
			next: res => {
				if (!res.data.error) {
					this.itemsChanged = res.data.diffParts;
					this.newItems = res.data.newParts;
					this.flagSpiner = false;
					this.fileVerified = true;
				} else {
					if (res.data.list) {
						// File contains invalid data
						this.closeDialogWithError({
							error: res.data.error,
							list: res.data.list,
						});
					} else {
						// File could not be uploaded
						this.closeDialog();
						this.errorSnack(res.data.error);
					}
				}
			},
			error: error => {
				this.closeDialog();
				this.errorSnack(error);
			},
		});
	}

	addParts() {
		this.flagSpiner = true;
		if (this.fileVerified) {
			this.partsWherehouseService.addParts(this.fileToUpload, this.token).subscribe({
				next: res => {
					this.closeSnack(this.itemsChanged, this.newItems);
					this.closeDialog();
				},
				error: error => {
					this.closeDialog();
				},
			});
		} else {
			this.closeDialog();
			this.closeSnack(this.itemsChanged, this.newItems);
		}
	}

	closeDialog() {
		this.flagSpiner = false;
		this.dialogRef.close();
	}

	closeDialogWithError(error: UploadError) {
		this.flagSpiner = false;
		this.dialogRef.close(error);
	}

	closeSnack(numUpdated: any, numNew: any) {
		this._snackBar.open(`${numUpdated} modificados y ${numNew} nuevos.`, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	errorSnack(message: String) {
		this._snackBar.open(`Error: ${message}`, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}
}
