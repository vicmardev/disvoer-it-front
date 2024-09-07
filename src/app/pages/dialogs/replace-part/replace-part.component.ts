import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PartsWerehouseService} from 'src/app/services/partsWerehouse/parts-werehouse.service';
import {MatTableDataSource} from '@angular/material/table';
import {Parts} from 'src/app/models/partsWerehouse';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TicketsService} from 'src/app/services/tickets/tickets.service';
import {MatSnackBar} from '@angular/material/snack-bar';

interface PartData {
	id: string;
	client: string;
	contract: string;
	replaceDate: Date;
	ticket: string;
	status: boolean;
}

@Component({
	selector: 'app-replace-part',
	templateUrl: './replace-part.component.html',
	styleUrls: ['./replace-part.component.scss'],
})
export class ReplacePartComponent implements OnInit {
	dataSource = new MatTableDataSource<Parts>();
	selection = new SelectionModel<Parts>(false, []);
	displayedColumns = ['select', 'serialNumber'];
	@ViewChild(MatPaginator)
	paginator!: MatPaginator;
	response: any;
	partData?: PartData;

	statusResponse = [
		{value: 'Canceled', name: 'Cancelado'},
		{value: 'Complete', name: 'Completo'},
	];

	responseSupport: FormGroup = this._formBuilder.group({
		solution: ['', Validators.required],
		status: ['', Validators.required],
		stepTicket: [''],
		dateSolution: [''],
		ticketID: [''],
	});

	responseSupportReassign: FormGroup = this._formBuilder.group({
		solution: ['', Validators.required],
		solutionReassig: ['', Validators.required],
		status: ['', Validators.required],
		stepTicket: [''],
		dateSolutionReassig: [''],
		dateSolution: [''],
		ticketID: [''],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _partsWherehouseService: PartsWerehouseService,
		private dialogRef: MatDialogRef<any>,
		private _formBuilder: FormBuilder,
		private _ticketService: TicketsService,
		private _snackBar: MatSnackBar
	) {
		if (this.data.ticket.issueType === 'Hardware') {
			this.response =
				data.ticket.status !== 'Reassigned'
					? this.responseSupport
					: this.responseSupportReassign;
		} else {
			this.response = this.responseSupport;
		}

		this.getAvailableParts(data.ticket);
	}

	ngOnInit(): void {}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}

	private getAvailableParts(ticket: any) {
		this._partsWherehouseService
			.getAvailableParts(ticket)
			.subscribe((availableParts: any) => {
				this.dataSource.data = availableParts;
			});
	}

	closeDialog() {
		this.dialogRef.close({status: 'canceled'});
	}

	sendResponse() {
		this.setFormValues();
		if (this.data.ticket.issueType == 'Hardware') {
			this._ticketService
				.updateInventoryTicket(this.data.ticket.id, this.responseSupport.value)
				.subscribe(
					result => {
						this._partsWherehouseService
							.assignPart(this.partData?.id, this.partData)
							.subscribe(
								result => {
									this._snackBar.open(`Actualizando ticket`, '', {
										duration: 3500,
										verticalPosition: 'top',
										panelClass: ['background-snack-info'],
									});
									this.dialogRef.close({
										status: 'success',
										data: this.form.status.value,
									});
								},
								error => {
									this.dialogRef.close({status: 'error', type: 'updating part'});
								}
							);
					},
					error => {
						this.dialogRef.close({
							status: 'error',
							type: 'updating ticket',
						});
					}
				);
		} else {
		}
	}

	private setFormValues() {
		this.form.ticketID.setValue(this.data.ticket.ticketID);
		this.form.stepTicket.setValue(5);
		this.form.dateSolution.setValue(new Date());

		if (this.data.ticket.issueType == 'Hardware') {
			this.partData = {
				id: this.selection.selected[0].id,
				client: this.data.ticket.client,
				contract: this.data.ticket.contract,
				replaceDate: new Date(),
				ticket: this.data.ticket.ticketID,
				status: false,
			};
		}
	}

	get form() {
		if (this.data.ticket.status != 'Reassigned') return this.responseSupport.controls;
		else return this.responseSupportReassign.controls;
	}

	notifyNoAvailableParts() {
		const part = {
			brand: this.data.ticket.brand,
			model: this.data.ticket.model,
			part: this.data.ticket.equipment,
			partNumber: this.data.ticket.affectationPart,
		};

		this._partsWherehouseService.notifyNoAvailableParts(part).subscribe((result: any) => {
			if (result.state == 'success') {
				this.dialogRef.close({});
				this._snackBar.open(`Notificación enviada al administrador`, '', {
					duration: 3500,
					verticalPosition: 'top',
					panelClass: ['background-snack-info'],
				});
			}
		});
	}
}
