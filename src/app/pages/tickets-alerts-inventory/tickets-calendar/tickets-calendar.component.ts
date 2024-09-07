import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CalendarOptions} from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import {forkJoin} from 'rxjs';
import {stringToColor} from 'src/app/helpers';
import {calendarEvent} from 'src/app/models/calendar-events';
import {GraphicService} from 'src/app/services/graphic/graphic.service';
import {TasksService} from 'src/app/services/tasks/tasks.service';
import {TicketsService} from 'src/app/services/tickets/tickets.service';
import {AddTicketComponent} from './dialogs/add-task/add-task.component';
import {EditTaskComponent} from './dialogs/edit-task/edit-task.component';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // used for tooltip styling

interface CalendarEvent {
	name: string;
	selected: boolean;
	color: string;
	ticketCount: number;
}

@Component({
	selector: 'app-tickets-calendar',
	templateUrl: './tickets-calendar.component.html',
	styleUrls: ['./tickets-calendar.component.scss'],
})
export class TicketsCalendarComponent implements OnInit {
	calendarVisible: boolean = false;
	calendarOptions!: CalendarOptions;
	operators!: {
		name: string;
		selected: boolean;
		color: string;
		count: number;
	}[];
	operatorControl = new FormControl();

	calendarEvents!: calendarEvent[];
	filteredCalendarEvents!: calendarEvent[];

	allOperatorsSelected: boolean = true;
	allOperators = 'All';

	constructor(
		private _graphicService: GraphicService,
		private _ticketService: TicketsService,
		private _taskService: TasksService,
		private snackBar: MatSnackBar,
		public dialog: MatDialog,
		private cdr: ChangeDetectorRef
	) {
		this.calendarOptions = {
			initialView: 'dayGridMonth',
			headerToolbar: {
				left: 'prev today next',
				center: 'title',
				right: 'dayGridMonth,dayGridWeek,listWeek',
			},
			height: 750,
			locale: esLocale,
			dateClick: this.handleDateClick.bind(this),
			eventClick: this.handleEventClick.bind(this), //modal

			displayEventTime: false,
			eventDisplay: 'block',
			eventDidMount: this.mountTooltip.bind(this),
			events: this.filteredCalendarEvents,
		};
	}

	ngOnInit(): void {
		this.getOperators();
		this.getCalendarEvents();
	}

	getOperators() {
		let field = 'assignedSupportOperator';
		let mongoOperators = this._graphicService.getAllFieldTicket(field);
		let sqlOperators = this._taskService.getSelectorValues();
		forkJoin([mongoOperators, sqlOperators]).subscribe({
			next: ([mongo, sql]) => {
				let sqlOps: any = sql;
				sqlOps = sqlOps.Operators;
				sqlOps = sqlOps.map((op: any) => {
					return {
						name: op.viewValue,
						selected: true,
						color: stringToColor(op.viewValue),
						ticketCount: op.y,
					};
				});

				let mongoOps: any = mongo;
				mongoOps = mongoOps.map((op: any) => {
					return {
						name: op._id,
						selected: true,
						color: stringToColor(op._id),
						ticketCount: op.y,
					};
				});

				this.operators = this.joinOperators(mongoOps, sqlOps);
			},
			error: err => {
				console.log(err);
			},
		});
	}

	joinOperators(mongoOps: any, sqlOps: any) {
		//insert operators into array
		let operatorIndex: Map<string, number> = new Map();
		let operatorArray = [];

		for (const operator of mongoOps) {
			if (!operatorIndex.has(operator.name)) {
				const index = operatorArray.length;
				operatorArray.push(operator);
				operatorIndex.set(operator.name, index);
			} else {
				const index = operatorIndex.get(operator.name);
				if (index) operatorArray[index].ticketCount += operator.ticketCount;
			}
		}

		for (const operator of sqlOps) {
			if (!operatorIndex.has(operator.name)) {
				const index = operatorArray.length;
				operatorArray.push(operator);
				operatorIndex.set(operator.name, index);
			} else {
				const index = operatorIndex.get(operator.name);
				if (index != undefined) {
					operatorArray[index].ticketCount += operator.ticketCount;
				}
			}
		}

		return operatorArray;
	}

	getCalendarEvents() {
		let ticketEvents = this._ticketService.getTicketsCalendar();
		let taskEvents = this._taskService.getTaskCalendar();

		forkJoin([ticketEvents, taskEvents]).subscribe({
			next: ([tickets, task]) => {
				this.calendarEvents = tickets.concat(task);
				this.filteredCalendarEvents = this.calendarEvents;
				this.calendarOptions.events = this.filteredCalendarEvents;
			},
			error: err => {
				console.log(err);
			},
		});
	}

	ngAfterViewInit() {
		this.calendarVisible = true;
		this.cdr.detectChanges();
	}

	handleDateClick(arg: any) {
		this.openAddDialog(arg.date);
	}

	handleEventClick(arg: any) {
		if (!this.isTask(arg.event.extendedProps.type)) return this.isNotTaskSnack();
		this.openEditDialog(arg.event.id);
	}

	mountTooltip(arg: any) {
		const message = `<b>${arg.event.extendedProps.tooltipTitle}</b> <br> ${arg.event.extendedProps.description}`;
		tippy(arg.el, {
			content: message,
			placement: 'bottom',
			arrow: true,
			theme: 'material',
			interactive: true,
			allowHTML: true, //opens tooltip to xss attack if parsing user input
		});
	}

	isTask(type: string): boolean {
		return type === 'task';
	}

	someComplete(): boolean {
		if (this.operators == undefined || this.operators.length == 0) {
			return false;
		}
		return (
			this.operators.filter(op => op.selected).length > 0 && !this.allOperatorsSelected
		);
	}

	setAll(completed: boolean) {
		this.allOperatorsSelected = completed;

		if (this.operators.length == 0) {
			return;
		}
		this.operators.forEach(op => (op.selected = completed));
		//filter
		this.filteredCalendarEvents = completed ? this.calendarEvents : [];
		this.calendarOptions.events = this.filteredCalendarEvents;
	}

	updateAllComplete() {
		this.allOperatorsSelected =
			this.operators.length > 0 && this.operators.every(t => t.selected);
		let operatorFilter = '';
		for (const operator of this.operators) {
			if (operator.selected == false) {
				operatorFilter += operator.name;
			}
		}
		this.filteredCalendarEvents = this.calendarEvents.filter(
			event => !operatorFilter.includes(event.groupId)
		);

		this.calendarOptions.events = this.filteredCalendarEvents;
	}

	openAddDialog(date: string) {
		const dialogRef = this.dialog.open(AddTicketComponent, {
			width: '40rem',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: date,
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getOperators();
			this.getCalendarEvents();
		});
	}

	openEditDialog(id: any) {
		const dialogRef = this.dialog.open(EditTaskComponent, {
			width: '40rem',
			height: 'auto',
			autoFocus: false,
			maxHeight: '90vh',
			data: {
				task: id,
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getOperators();
			this.getCalendarEvents();
		});
	}

	isNotTaskSnack() {
		this.snackBar.open(`Error: El evento no es una tarea.`, '', {
			duration: 3500,
			verticalPosition: 'top',
			/* horizontalPosition: 'center', */
			panelClass: ['background-snack-red'],
		});
	}
}
