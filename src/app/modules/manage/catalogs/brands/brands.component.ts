import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {BrandsService} from 'src/app/services/brands/brands.service';
import {AddBrandComponent} from '../dialogs/add-brand/add-brand.component';
import {DeleteBrandComponent} from '../dialogs/delete-brand/delete-brand.component';
import {EditBrandComponent} from '../dialogs/edit-brand/edit-brand.component';

@Component({
	selector: 'app-brands',
	templateUrl: './brands.component.html',
	styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit {
	ordersList: any;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	dataSource!: MatTableDataSource<any>;
	selectedRowIndex: number = -1;
	rowSelect: any;

	displayedColumns: string[] = ['Nombre', 'Descripción', 'Fecha de Registro', 'Acciones'];

	constructor(private brandService: BrandsService, public dialog: MatDialog) {}

	ngOnInit(): void {
		this.getBrandList();
	}

	getBrandList() {
		this.brandService.getBrandList().subscribe(result => {
			this.ordersList = result;
			this.dataSource = new MatTableDataSource(this.ordersList);
			setTimeout(() => {
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			});
			return this.dataSource;
		});
	}

	/* Add brand */
	openDialog() {
		const dialogRef = this.dialog.open(AddBrandComponent, {
			width: '460px',
			height: 'auto',
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

	deleteBrand(brand: any) {
		const dialogRef = this.dialog.open(DeleteBrandComponent, {
			width: 'auto',
			height: 'auto',
			data: {
				info: brand,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getBrandList();
		});
	}

	editBrand(brand: any) {
		const dialogRef = this.dialog.open(EditBrandComponent, {
			width: '460px',
			height: 'auto',
			data: {
				info: brand,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getBrandList();
		});
	}
}
