import {
	Component,
	Input,
	OnInit,
	SimpleChanges,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatStepper} from '@angular/material/stepper';
import {skewDegrees} from 'pdf-lib';
import {AppproveTicketComponent} from 'src/app/pages/dialogs/ticket-alert/appprove-ticket/appprove-ticket.component';
import {ReassignTicketComponent} from 'src/app/pages/dialogs/ticket-alert/reassign-ticket/reassign-ticket.component';
import {TicketsService} from 'src/app/services/tickets/tickets.service';
/* fake modal */
import {FakeModalComponent} from 'src/app/pages/dialogs/fake-modal/fake-modal.component';
import {FakeModal2Component} from 'src/app/pages/dialogs/fake-modal/fake-modal2/fake-modal2.component';
import {ReplacePartComponent} from 'src/app/pages/dialogs/replace-part/replace-part.component';

@Component({
	selector: 'app-steppers',
	templateUrl: './steppers.component.html',
	styleUrls: ['./steppers.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class SteppersComponent implements OnInit {
	ticketID: string = '';
	contract: string = '';
	equipment: string = '';
	title: string = '';
	created: any;
	severity: string = '';
	description: string = '';
	issueType: string = '';
	model: string = '';
	affectationPart: any;
	assignedSupportOperator: string = '';
	status: string = '';

	stepperParent: any;
	firstFormGroup!: FormGroup;
	secondFormGroup!: FormGroup;
	titleTicket: string = '';
	dateCreation: any;
	phaseTicket: number = 0;
	statusPhase: boolean = false;
	isEditable: boolean = false;
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

	@Input() selectTicket: any;
	@ViewChild('stepper', {read: MatStepper}) stepper!: MatStepper;

	constructor(
		private _formBuilder: FormBuilder,
		private _ticketService: TicketsService,
		private _snackBar: MatSnackBar,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {}

	get spanishStatus() {
		switch (this.selectTicket.status) {
			case 'Complete':
				return 'Completo';
				break;
			case 'Canceled':
				return 'Cancelado';
				break;

			case 'Reassigned':
				return 'Reasignado';
				break;

			case 'Pending':
				return 'En espera';
				break;

			default:
				return ' No conocido';
				break;
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		setTimeout(() => {
			if (!this.selectTicket) return;
			console.log(this.selectTicket);

			this.titleTicket = this.selectTicket.description;
			this.dateCreation = this.selectTicket.ticketRegistrationDate;
			this.phaseTicket = this.selectTicket.stepTicket ? this.selectTicket.stepTicket : 3;
			this.stepper.selectedIndex = this.phaseTicket - 1;
		});

		this.ticketID = this.selectTicket.ticketID;
		this.contract = this.selectTicket.contract;
		this.equipment = this.selectTicket.equipment;
		this.severity = this.selectTicket.severity;
		this.description = this.selectTicket.description;
		this.issueType = this.selectTicket.issueType;
		this.model = this.selectTicket.model;
		this.affectationPart = this.selectTicket.affectationPart;
		this.assignedSupportOperator = this.selectTicket.assignedSupportOperator;
		this.status = this.selectTicket.status;
	}

	get form() {
		if (this.selectTicket.status != 'Reassigned') return this.responseSupport.controls;
		else return this.responseSupportReassign.controls;
	}

	setFormValues() {
		this.form.ticketID.setValue(this.selectTicket.ticketID);
		this.form.stepTicket.setValue(5);
		this.form.dateSolution.setValue(new Date());

		console.log(this.form.status.value);

		if (this.selectTicket.solution && this.selectTicket.status != 'Reassigned') {
			this.form.status.setValue(this.selectTicket.status);
			this.responseSupport.get('solution')?.setValue(this.selectTicket.solution);
			this.responseSupport.disable();
		} else if (this.selectTicket.status != 'Reassigned') {
			this.responseSupport.enable();
		} else if (this.selectTicket.status == 'Reassigned') {
			this.form.dateSolutionReassig.setValue(new Date());
			this.form.solution.setValue(this.selectTicket.solution);
			this.form.dateSolution.setValue(this.selectTicket.dateSolution);
			if (
				this.selectTicket.solutionReassig &&
				this.selectTicket.solutionReassig != '' &&
				this.selectTicket.status != 'Reassigned'
			) {
				this.responseSupportReassign
					.get('solutionReassig')
					?.setValue(this.selectTicket.solutionReassig);
				this.responseSupportReassign.disable();
			} else {
				this.responseSupportReassign.enable();
			}
		}
	}

	OpenDialogAproveTicket(rowInfo: any) {
		const dialogRef = this.dialog.open(AppproveTicketComponent, {
			width: 'auto',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				info: rowInfo,
				type: 'inventory',
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) this.goToStep(result);
		});
	}

	OpenDialogReassignTicket(rowInfo: any) {
		const dialogRef = this.dialog.open(ReassignTicketComponent, {
			width: 'auto',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				info: rowInfo,
				type: 'inventory',
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.goToStepReasing(result);
			}
		});
	}

	goToStep(step: number) {
		this.phaseTicket = step;
		this.selectTicket.stepTicket = step;
		this._ticketService.getAll().subscribe((res: any) => {
			let ticket = res;

			ticket = ticket.filter((x: any) => x.id == this.selectTicket.id)[0];
			console.log('ticket', ticket);
			this.selectTicket = ticket;
		});

		this.stepper.selectedIndex = this.phaseTicket - 1;
		this.stepper.selectedIndex = step - 1;
	}

	goToStepReasing(step: number) {
		this.phaseTicket = step;
		this.selectTicket.stepTicket = step;
		this.selectTicket.status = 'Reassigned';
		this._ticketService.getAll().subscribe((res: any) => {
			let ticket = res;

			ticket = ticket.filter((x: any) => x.id == this.selectTicket.id)[0];
			this.selectTicket = ticket;
		});

		this.stepper.selectedIndex = this.phaseTicket - 1;
		this.stepper.selectedIndex = step - 1;
	}

	replacePart() {
		this.openReplacePartDialog();
	}

	private openReplacePartDialog() {
		const dialogRef = this.dialog.open(ReplacePartComponent, {
			width: '720px',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {ticket: this.selectTicket},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result.status === 'success') {
				this.selectTicket.status = result.data;
				this.goToStep(5);
			}
		});
	}

	sendResponse() {
		this.setFormValues();
		if (this.selectTicket.status != 'Reassigned') {
			this._ticketService
				.updateInventoryTicket(this.selectTicket.id, this.responseSupport.value)
				.subscribe(res => {
					this.selectTicket.status = this.form.status.value;
					console.log('resp: ', res);
					this._snackBar.open(`Actualizando ticket`, '', {
						duration: 3500,
						verticalPosition: 'top',
						panelClass: ['background-snack-info'],
					});
					this.goToStep(5);
				});
		} else {
			console.log(this.responseSupportReassign.value, 'res');
			this._ticketService
				.updateInventoryTicket(this.selectTicket.id, this.responseSupportReassign.value)
				.subscribe(res => {
					this.selectTicket.status = this.form.status.value;
					console.log('rea res', res);
					this._snackBar.open(`Actualizando ticket`, '', {
						duration: 3500,
						verticalPosition: 'top',
						panelClass: ['background-snack-info'],
					});
					this.goToStep(5);
				});
		}
	}

	closeSnack() {
		this._snackBar.open('Ticket Modificado con Exito.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
			/*  horizontalPosition: 'start',
            verticalPosition: 'top', */
		});
	}

	errorSnack() {
		this._snackBar.open('Error al modificar Ticket', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
		});
	}

	/* Fake modal */
	openDialog() {
		const dialogRef = this.dialog.open(FakeModalComponent, {
			width: 'auto',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
			this.openDialog2(result);
		});
	}
	openDialog2(rowInfo: any) {
		const dialogRef = this.dialog.open(FakeModal2Component, {
			width: 'auto',
			height: 'auto',
			maxHeight: '90vh',
			data: {
				info: rowInfo,
			},
		});

		dialogRef.afterClosed();
	}
}
