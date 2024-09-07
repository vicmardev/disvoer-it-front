import {HttpClient} from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ContractsService} from 'src/app/services/contracts/contracts.service';
import {InventoryService} from 'src/app/services/inventory/inventory.service';

interface BackendResult {
	status: boolean;
	msg: string;
	data: any;
}

interface TotalResults {
	contracts: EntityResult;
	dataCenters: EntityResult;
	equipments: EntityResult;
}

interface EntityResult {
	new: number;
	updated: number;
}

@Component({
	selector: 'app-import-excel',
	templateUrl: './import-excel.component.html',
	styleUrls: ['./import-excel.component.scss'],
})
export class ImportExcelComponent implements OnInit {
	loading: boolean = false;
	token: string = 'Z^M%pK2R8Xg&ZJhY';
	hideToken: boolean = true;
	file: any;
	fileUploaded: boolean = false;
	totalResults?: TotalResults;

	constructor(
		private contractsService: ContractsService,
		public http: HttpClient,
		private _snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<any>
	) {}

	ngOnInit(): void {}

	onFileChange(event: any) {
		if (event.target.files.length > 0) {
			this.file = event.target.files[0];
		}
	}

	uploadFile() {
		this.loading = true;
		this.contractsService.importExcelFile(this.file, this.token).subscribe(res => {
			const result = res as BackendResult;
			if (result.status) {
				this.loading = false;
				this.fileUploaded = true;
				this.totalResults = result.data.diff;
			} else {
				const error = {status: false, msg: result.msg, data: undefined};
				if ('excelErrors' in result.data) {
					error.data = result.data;
				}
				this.closeDialog(error);
			}
		});
	}

	closeDialog(data: any) {
		this.dialogRef.close(data);
	}

	close() {
		this.closeDialog({status: true, msg: ''});
	}

	cancel() {
		this.closeDialog({status: false, msg: ''});
	}
}
