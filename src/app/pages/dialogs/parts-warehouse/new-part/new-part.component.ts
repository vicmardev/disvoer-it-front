import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {selectorValue} from 'src/app/models/selector-value';
import {PartsWerehouseService} from 'src/app/services/partsWerehouse/parts-werehouse.service';

@Component({
	selector: 'app-new-part',
	templateUrl: './new-part.component.html',
	styleUrls: ['./new-part.component.scss'],
})
export class NewPartComponent implements OnInit {
	partString = JSON.stringify(this.part);
	partTypeSelectorValues!: selectorValue[];
	providerSelectorValues!: selectorValue[];

	public logEquipmentForm = this._formBuilder.group({
		// IdPart: [this.part.IdPart ? this.part.IdPart : '', [Validators.required]], // check if id is included, if not find part by part number
		IdProvider: [this.part.IdProvider ? this.part.IdProvider : '', [Validators.required]],
		TypePart: [this.part.TypePart ? this.part.TypePart : '', [Validators.required]],
		Brand: [this.part.Brand ? this.part.Brand : '', [Validators.required]],
		Model: [this.part.Model ? this.part.Model : '', [Validators.required]],
		PartNumber: [this.part.PartNumber ? this.part.PartNumber : '', [Validators.required]],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public part: any,
		private _snackBar: MatSnackBar,
		private _formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<any>,
		private partWareHouseService: PartsWerehouseService
	) {}

	ngOnInit(): void {
		this.PartDoesNotExistSnack();

		this.partWareHouseService.getPartField().subscribe((res: any) => {
			this.partTypeSelectorValues = res;
		});

		this.partWareHouseService.getPartField('provider').subscribe((res: any) => {
			this.providerSelectorValues = res;
		});
	}

	ngAfterViewInit() {}
	PartDoesNotExistSnack() {
		this._snackBar.open('La Parte no existe.', '', {
			duration: 3500,
			verticalPosition: 'top',
			/* horizontalPosition: 'center', */
			panelClass: ['background-snack'],
		});
	}

	createNewPart() {
		this.partWareHouseService
			.newPart(this.logEquipmentForm.value)
			.subscribe((res: any) => {
				console.log('new part', res);

				this.partCreatedSnack();
				this.closeDialog(res);
			});
	}

	partCreatedSnack() {
		this._snackBar.open('La Parte fue agregada exitosamente.', '', {
			duration: 3500,
			verticalPosition: 'top',
			/* horizontalPosition: 'center', */
			panelClass: ['background-snack'],
		});
	}

	closeDialog(part: any) {
		this.dialogRef.close(part);
	}
}
