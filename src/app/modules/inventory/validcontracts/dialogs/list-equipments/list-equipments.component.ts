import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {IDataCenter} from 'src/app/models/IDataCenter';
import {IEquipment} from 'src/app/models/IEquipment';
import {ISLA} from 'src/app/models/ISLA';

import {ReportsService} from 'src/app/services/reports/reports.service';
import {EditEquipmentComponent} from '../edit-equipment/edit-equipment.component';
import {IDataCenterEquipment} from 'src/app/models/IDataCenterEquipment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ContractsService} from 'src/app/services/contracts/contracts.service';
import {IQueryResult} from 'src/app/models/IQueryResult';
import {IContracTime} from 'src/app/models/IContractTime';

interface Equipment extends IEquipment {
	NameBrand: String;
	TypePartName: String;
	ProviderName: String;
	DataCenterEquipment: DataCenterEquipment;
}

interface DataCenterEquipment extends IDataCenterEquipment {
	NameSLA: String | null;
	ContracTimeName: String;
}

interface ContractTime extends IDataCenterEquipment {
	NameContractTime: String;
}

interface SelectFields {
	TypePartName: String;
	NameBrand: String;
	ProviderName: String;
	NameSLA: String;
	ContracTimeName: String;
}

@Component({
	selector: 'app-list-equipments',
	templateUrl: './list-equipments.component.html',
	styleUrls: ['./list-equipments.component.scss'],
})
export class ListEquipmentsComponent implements OnInit {
	public selectedIdEquipment: number = 0;
	public loadedTableData: Boolean = false;
	public tableData: Equipment[] = [];
	public tableDataSource = new MatTableDataSource<Equipment>();
	public tableColumns: String[] = [
		'partType',
		'model',
		'brand',
		'serial',
		'provider',
		'serialProvider',
		'sla',
		'months',
		'serviceTag',
		'ip',
		'actions',
	];
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	public uniqueParts: Set<String> = new Set();
	public uniqueBrands: Set<String> = new Set();
	public uniqueProviders: Set<String> = new Set();
	public uniqueSLA: Set<String | null> = new Set();
	public uniqueContractTime: Set<String | null> = new Set();
	public filters = new Map();
	public selectFields: SelectFields = {
		TypePartName: '',
		NameBrand: '',
		ProviderName: '',
		NameSLA: '',
		ContracTimeName: '',
	};
	public filterApplied = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private contractsService: ContractsService,
		private reportsService: ReportsService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar
	) {
		this.loadEquipmentData();
	}

	ngAfterViewInit() {
		this.tableDataSource.paginator = this.paginator;
	}

	ngOnInit(): void {}

	private async loadEquipmentData() {
		const dataCenter: IDataCenter = this.data.dataCenter;

		const SLAResult = await this.contractsService.getAllSLA().toPromise();
		if (!SLAResult.status) {
			this.errorExit(SLAResult.msg);
		}

		const ContractTimeResult = (await this.contractsService
			.getAllContractTime()
			.toPromise()) as IQueryResult;
		if (!ContractTimeResult.status) {
			this.errorExit(ContractTimeResult.msg);
		}

		//console.log(ContractTimeResult);

		const EquipmentResult = await this.contractsService
			.getAllEquipmentsOfDataCenter(dataCenter.IdDataCenter)
			.toPromise();
		if (!EquipmentResult.status) {
			this.errorExit(EquipmentResult.msg);
		}

		this.tableData = EquipmentResult.data as Equipment[];

		for (const equipment of this.tableData) {
			// SLA
			if (equipment.DataCenterEquipment.IdSLA) {
				const SLA = SLAResult.data.filter(
					(SLA: ISLA) => equipment.DataCenterEquipment.IdSLA == SLA.IdSLA
				)[0];
				equipment.DataCenterEquipment.NameSLA = SLA.Name;
			} else {
				equipment.DataCenterEquipment.NameSLA = null;
			}

			// Contract Time
			const ContracTime = ContractTimeResult.data.filter(
				(ContracTime: IContracTime) =>
					equipment.DataCenterEquipment.IdContractTime == ContracTime.IdContractTime
			)[0];
			equipment.DataCenterEquipment.ContracTimeName = ContracTime.Duration;
		}

		this.getUniquePats(this.tableData);
		this.getUniqueBrands(this.tableData);
		this.getUniqueProvider(this.tableData);
		this.getUniqueSLA(this.tableData);
		this.getUniqueContractTime(this.tableData);
		this.loadedTableData = true;
		this.tableDataSource.data = this.tableData;
	}

	private errorExit(msg: string) {
		this.showSnackbar(msg, 'error');
		this.loadedTableData = true;
		return;
	}

	openTerminal(programa: string) {
		this.reportsService.getOpenTerminal(programa).subscribe((res: any) => {
			console.log(res);
		});
	}

	applySearchFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.tableDataSource.filter = filterValue.trim().toLowerCase();
		if (this.tableDataSource.paginator) {
			this.tableDataSource.paginator.firstPage();
		}
	}

	selectEquipment(equipment: Equipment) {
		this.selectedIdEquipment = equipment.IdEquipment;
	}

	deselectEquipment() {
		this.selectedIdEquipment = 0;
	}

	editEquipment(equipment: Equipment) {
		this.selectEquipment(equipment);

		const dialogRef = this.dialog.open(EditEquipmentComponent, {
			width: '400px',
			height: '360px',
			maxHeight: '90vh',
			data: {
				equipment: equipment,
			},
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			this.deselectEquipment();
			this.loadEquipmentData();
		});
	}

	private getUniquePats(equipmentList: Equipment[]) {
		equipmentList.map((equipment: Equipment) =>
			this.uniqueParts.add(equipment.TypePartName)
		);
	}

	private getUniqueBrands(equipmentList: Equipment[]) {
		equipmentList.map((equipment: Equipment) =>
			this.uniqueBrands.add(equipment.NameBrand)
		);
	}

	private getUniqueProvider(equipmentList: Equipment[]) {
		equipmentList.map((equipment: Equipment) =>
			this.uniqueProviders.add(equipment.ProviderName)
		);
	}

	private getUniqueSLA(equipmentList: Equipment[]) {
		equipmentList.map((equipment: Equipment) =>
			this.uniqueSLA.add(equipment.DataCenterEquipment.NameSLA)
		);
	}

	private getUniqueContractTime(equipmentList: Equipment[]) {
		equipmentList.map((equipment: Equipment) =>
			this.uniqueContractTime.add(equipment.DataCenterEquipment.ContracTimeName)
		);
	}

	filterSelect(event: any, filterName: String) {
		this.filterApplied = true;
		this.filters.set(filterName, event.value);
		this.tableDataSource.data = this.tableData;

		const searchResults = this.tableData.filter(equipment => {
			let isMatch = new Array();
			let columnValue = null;
			for (let [key, value] of this.filters) {
				switch (key) {
					case 'NameSLA':
						columnValue = equipment.DataCenterEquipment.NameSLA;
						break;
					case 'ContracTimeName':
						columnValue = equipment.DataCenterEquipment.ContracTimeName;
						break;
					default:
						columnValue = equipment[key as keyof Equipment];
						break;
				}
				isMatch.push(value === 'ALL' || columnValue === value);
			}
			return !isMatch.includes(false);
		});

		this.tableDataSource.data = searchResults;
		this.showFilterResults(searchResults.length);
	}

	private showFilterResults(numResults: number) {
		this.showSnackbar(
			`Existen ${numResults} registros`,
			numResults > 0 ? 'message' : 'error'
		);
	}

	clearFilters() {
		this.filterApplied = false;
		for (let [key, value] of this.filters) {
			this.filters.set(key, 'ALL');
			this.selectFields[key as keyof SelectFields] = '';
		}
		this.tableDataSource.data = this.tableData;
		this.showSnackbar('Filtros eliminados');
	}

	private showSnackbar(msg: string, type: string = 'message') {
		this.snackBar.open(msg, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: [type === 'message' ? 'background-snack-info' : 'background-snack-red'],
		});
	}
}
