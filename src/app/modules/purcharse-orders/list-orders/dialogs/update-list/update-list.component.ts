import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {OrderPurchaseService} from 'src/app/services/orderPurchase/order-purchase.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
	selector: 'app-update-list',
	templateUrl: './update-list.component.html',
	styleUrls: ['./update-list.component.scss'],
})
export class UpdateListComponent implements OnInit {
	updateList: any;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	dataSource!: MatTableDataSource<any>;
	displayedColumns: string[] = ['Status', 'Comments', 'User', 'Date'];
	constructor(
		private orderService: OrderPurchaseService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {
		this.orderService.getHistory(this.data.info.NumOrder).subscribe(result => {
			this.updateList = result;
			this.dataSource = new MatTableDataSource(this.updateList);
			setTimeout(() => {
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			});
			return this.dataSource;
		});
	}
}
