import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

export type ExcelError = {
	error: string;
	row: number;
	column: number;
	value: string;
	reason: string;
};

@Component({
	selector: 'app-show-excel-errors',
	templateUrl: './show-excel-errors.component.html',
	styleUrls: ['./show-excel-errors.component.scss'],
})
export class ShowExcelErrorsComponent implements OnInit {
	dataSource = new MatTableDataSource<ExcelError>();
	displayedColumns = ['error', 'row', 'column', 'value', 'reason'];

	@ViewChild(MatPaginator)
	paginator!: MatPaginator;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<any>
	) {
		this.dataSource.data = data.error;
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}
	ngOnInit(): void {}

	closeDialog() {
		this.dialogRef.close();
	}
}
