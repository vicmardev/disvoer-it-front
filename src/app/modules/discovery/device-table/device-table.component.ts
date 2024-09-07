import {
	ChangeDetectorRef,
	Component,
	Input,
	OnInit,
	QueryList,
	SimpleChange,
	SimpleChanges,
	ViewChild,
	ViewChildren,
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Chassis} from 'src/app/models/chassis';
import {ComponentChassis} from 'src/app/models/Component-chassis';

@Component({
	selector: 'device-table',
	templateUrl: './device-table.component.html',
	styleUrls: ['./device-table.component.scss'],
})
export class DeviceTableComponent implements OnInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild('outerSort', {static: true}) sort!: MatSort;
	@ViewChildren('innerSort') innerSort!: QueryList<MatSort>;
	@ViewChildren('innerTables') innerTables!: QueryList<MatTable<ComponentChassis>>;

	@Input() tableData!: Chassis[];

	dataSource = new MatTableDataSource<Chassis>();
	tableReady: any;
	columnsToDisplay = [
		'IdChasisEquipment',
		'Hostname',
		'Ip',
		'Brand',
		'Model',
		'SerialNumber',
		'FirmwareVersion',
		'Type',
		'createdAt',
		'updatedAt',
	];
	innerDisplayedColumns = [
		'IdComponent',
		'IdChasis',
		'TypeComponent',
		'SerialNumber',
		'PartNumber',
		'Description',
		'Brand',
		'Model',
		'createdAt',
		'updatedAt',
	];
	expandedElement: any;

	constructor(private cd: ChangeDetectorRef) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.dataSource.data = changes.tableData.currentValue;
	}

	toggleRow(element: Chassis) {
		element.components &&
		(element.components as MatTableDataSource<ComponentChassis>).data.length
			? (this.expandedElement = this.expandedElement === element ? null : element)
			: null;
		this.cd.detectChanges();
		this.innerTables.forEach(
			(table, index) =>
				((table.dataSource as MatTableDataSource<ComponentChassis>).sort =
					this.innerSort.toArray()[index])
		);
	}

	applyFilter(filterValue: any) {
		this.innerTables.forEach(
			(table, index) =>
				((table.dataSource as MatTableDataSource<ComponentChassis>).filter =
					filterValue.value.trim().toLowerCase())
		);
	}
}
