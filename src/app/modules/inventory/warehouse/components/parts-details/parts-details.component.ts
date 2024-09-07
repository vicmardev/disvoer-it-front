import {Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Parts} from 'src/app/models/partsWerehouse';
import {PartsWerehouseService} from 'src/app/services/partsWerehouse/parts-werehouse.service';
import {MatPaginator} from '@angular/material/paginator';

@Component({
	selector: 'app-parts-details',
	templateUrl: './parts-details.component.html',
	styleUrls: ['./parts-details.component.scss'],
})
export class PartsDetailsComponent implements OnInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@Input() part!: Parts;
	tableInfo: any;
	dataSource = new MatTableDataSource<Parts>();
	displayedColumns: string[] = [
		'serialNumber',
		'status',
		'client',
		'contract',
		'ticket',
		'replaceDate',
	];

	constructor(private _partsWerehouseService: PartsWerehouseService) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.getPart();
	}

	getPart() {
		this._partsWerehouseService.getRelatedParts(this.part).subscribe((partsList: any) => {
			this.tableInfo = partsList;
			this.dataSource.data = partsList;
		});
	}
}
