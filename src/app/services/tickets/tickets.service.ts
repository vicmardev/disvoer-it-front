import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subject, timer} from 'rxjs';
import {User} from 'src/app/models/User';
import {AuthService} from 'src/app/auth/auth.service';
import {environment} from 'src/environments/environment';
import {stringToColor} from 'src/app/helpers';
import {map, finalize} from 'rxjs/operators';
import {calendarEvent} from 'src/app/models/calendar-events';
import {Tickets} from '../../models/Tickets';
import {operatorNotifier} from 'src/app/models/operator-notifier';
import {Map} from 'leaflet';
import {tick} from '@angular/core/testing';
import {retry, share, switchMap, takeUntil} from 'rxjs/operators';

const baseUrl = `${environment.apiUrl}/tickets`;
const baseTickets = `${environment.apiUrl}/ticket-alert`;

@Injectable({
	providedIn: 'root',
})
export class TicketsService {
	private userSubject!: BehaviorSubject<User>;
	public user!: Observable<User>;
	private TicketsAlarmsByOperator!: Observable<any>;
	private stopPolling = new Subject();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService
	) {
		const second = 1000;
		const refreshTime = 40 * second;
		this.TicketsAlarmsByOperator = timer(1, refreshTime).pipe(
			switchMap(() => this.getTicketsAlarmsByOperator()),
			retry(),
			share(),
			takeUntil(this.stopPolling)
		);
	}

	public get userValue(): User {
		return this.authService.currentUserValue;
	}

	getAll() {
		return this.http.get(baseUrl);
	}
	getAllInventoryTickets() {
		return this.http.get(baseUrl);
	}

	createInventoryTicket(data: any) {
		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		formData.append('userEmail', this.userValue.email);
		formData.append(
			'userClient',
			`${this.userValue.firstName} ${this.userValue.lastName}`
		);
		console.log('FORMDATA', formData);

		return this.http.post(`${baseUrl}`, formData);
	}

	updateInventoryTicket(id: string, data: any) {
		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.put(`${baseUrl}/${id}?filePath=''`, formData);
	}
	createTicket(data: any) {
		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		formData.append('userEmail', this.userValue.email);
		formData.append(
			'userClient',
			`${this.userValue.firstName} ${this.userValue.lastName}`
		);
		return this.http.post(`${baseTickets}/create`, formData);
	}

	createAlertTicket(data: any) {
		console.log(data);
	}
	updateTicket(id: any, data: any) {
		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.put(`${baseTickets}/${id}`, formData);
	}

	updateTicketFile(id: any, filePath: any) {
		console.log('Entro a updateTicket');

		return this.http.put(`${baseTickets}/${id}?filePath=${filePath}`, '');
	}
	//all  tickets alrmas
	getAllAlarms() {
		return this.http.get(baseTickets);
	}

	postResponseTicket(data: any, file: any) {
		const formData = new FormData();
		formData.append('img_evidence', file, file.name);
		console.log('Este es el valor de file', file);
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.post(`${baseTickets}/response`, formData, file);
	}

	postQuestions(data: any) {
		console.log('data', data);

		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		console.log('form', formData);
		return this.http.post(`${baseTickets}/questions`, data);
	}

	updateAlertTicket(id: string, data: any, file: any) {
		console.log('Este es el valor de file', file);
		const formData = new FormData();
		formData.append('img_evidenceReassing', file);
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		console.log('El valor de file es: ', file);
		return this.http.put(`${baseTickets}/${id}`, formData, file);
		//return  this.http.put(`${baseTickets}/${id}`, data);
	}

	reassignAlertTicket(id: string, data: any) {
		return this.http.put(`${baseTickets}/${id}?case=reassign`, data);
	}

	reassignInventoryTicket(id: string, data: any) {
		return this.http.put(`${baseUrl}/${id}?case=reassign`, data);
	}

	getTicketAlertById(id: any) {
		return this.http.get(`${baseTickets}/${id}`);
	}

	getAlertByOperator() {
		return this.http.get(`${baseTickets}/group`);
	}

	getImage(filePath: string) {
		let urlImage = `${baseTickets}?filePath=${filePath}`;
		return urlImage;
		/* console.log("Este es el valor: ",urlImage);
    return this.http.get(`${baseTickets}?filePath=${filePath}`, {responseType: 'arraybuffer'}); */
	}

	getTicketsCalendar(): Observable<calendarEvent[]> {
		return this.getAllAlarms().pipe(
			map(res => {
				let tickets: any = res;
				let calendarEvents = tickets.map((ticket: any) => {
					return {
						type: 'ticket',
						tooltipTitle: ticket.titleTicket,
						description: `<br>Host: ${ticket.host} <br>Serial: ${ticket.serial} <br>${ticket.affectedPart} ${ticket.response}`,
						id: ticket.ticketID,
						groupId: ticket.responsableReassig
							? ticket.responsableReassig
							: ticket.supportAssignment,
						title: `${
							ticket.responsableReassig
								? ticket.responsableReassig
								: ticket.supportAssignment
						}: ${ticket.ticketID}`,
						start: `${ticket.ticketRegistrationDate}`,
						end: `${
							ticket.dateSolutionReassig
								? ticket.dateSolutionReassig
								: ticket.dateSolution
						}`,
						color: stringToColor(
							ticket.responsableReassig
								? ticket.responsableReassig
								: ticket.supportAssignment
						),
						displayEventTime: false,
					};
				});
				return calendarEvents;
			})
		);
	}

	getTicketsAlarmsByOperator(): Observable<operatorNotifier[]> {
		return this.getAlertByOperator().pipe(
			map(res => {
				let tickets: any = res;
				let operatorTickets = tickets.map((ticket: any) => {
					return {
						name: ticket._id,
						tickets: ticket.tickets,
					};
				});
				return operatorTickets;
			})
		);
	}

	ngOnDestroy(): void {
		this.stopPolling.next(true);
	}
	getServiceTicketAlerts() {
		return this.TicketsAlarmsByOperator;
	}

	setTicketAlias(data: any) {
		return this.http.post(`${baseTickets}/alias`, data);
	}
}
