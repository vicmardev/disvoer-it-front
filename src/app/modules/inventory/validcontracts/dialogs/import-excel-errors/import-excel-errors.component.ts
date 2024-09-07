import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

export type ErrorData = {
	excelErrors: ExcelError[];
	sheet: string;
};

export type ExcelError = {
	error: string;
	row: number;
	column: number;
	value: string;
	reason: string;
};

@Component({
	selector: 'app-import-excel-errors',
	templateUrl: './import-excel-errors.component.html',
	styleUrls: ['./import-excel-errors.component.scss'],
})
export class ImportExcelErrorsComponent implements OnInit {
	dataSource = new MatTableDataSource<ExcelError>();
	columns = ['error', 'row', 'column', 'value', 'reason'];
	@ViewChild(MatPaginator)
	paginator!: MatPaginator;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: ErrorData,
		private dialogRef: MatDialogRef<any>
	) {
		console.log(data.excelErrors);
		this.dataSource.data = data.excelErrors;
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}

	ngOnInit(): void {}

	close() {
		this.dialogRef.close();
	}
}
