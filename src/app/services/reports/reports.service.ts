import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subject, timer} from 'rxjs';
import {User} from 'src/app/models/User';
import {AuthService} from 'src/app/auth/auth.service';
import {environment} from 'src/environments/environment';
import {retry, share, switchMap, takeUntil} from 'rxjs/operators';
import {Query} from 'src/app/models/query';

const baseUrl = `${environment.apiUrl}/alarms`;
const alarmsUrl = `${environment.apiUrl}/alux`;

@Injectable({
	providedIn: 'root',
})
export class ReportsService implements OnDestroy {
	private userSubject!: BehaviorSubject<User>;
	public user!: Observable<User>;
	private serviceAlarms!: Observable<any>;
	private hostServiceAlarms!: Observable<any>;
	private counterHosts!: Observable<any>;
	private alarmsNotifiers!: Observable<any>;
	private stopPolling = new Subject();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService
	) {
		const second = 1000;
		const refreshTime = 50 * second;
		this.serviceAlarms = timer(1, refreshTime).pipe(
			switchMap(() => this._getServiceAlarms()),
			retry(),
			share(),
			takeUntil(this.stopPolling)
		);

		this.hostServiceAlarms = timer(1, refreshTime).pipe(
			switchMap(() => this._getHostServiceAlarms()),
			retry(),
			share(),
			takeUntil(this.stopPolling)
		);

		this.counterHosts = timer(1, refreshTime).pipe(
			switchMap(() => this._getcounterHosts()),
			retry(),
			share(),
			takeUntil(this.stopPolling)
		);

		this.alarmsNotifiers = timer(1, refreshTime).pipe(
			switchMap(() => this._getAlarmsNotifiers()),
			retry(5),
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

	getHostAlarms() {
		return this.http.get(`${alarmsUrl}/get-hosts`);
	}

	private _getServiceAlarms() {
		return this.http.get(`${alarmsUrl}/get-services`);
	}

	getServiceAlarms() {
		return this.serviceAlarms;
	}

	getHostServiceAlarms() {
		return this.hostServiceAlarms;
	}

	getAlarmsNotifiers() {
		return this.alarmsNotifiers;
	}

	getCounterHosts() {
		return this.counterHosts;
	}

	getHistoricInfo(serverName: string, partServer: string) {
		let formData = new FormData();
		formData.append('serverName', serverName);
		formData.append('ServiceName', partServer);
		return this.http.post(`${baseUrl}/historical`, formData);
	}

	getOpenTerminal(programa: string) {
		return this.http.get(`${baseUrl}/consola/${programa}`);
	}

	ngOnDestroy(): void {
		this.stopPolling.next(true);
	}

	private _getHostServiceAlarms() {
		return this.http.get(`${baseUrl}/filterHosts`);
	}

	_getServices(idHost: string) {
		return this.http.get(`${baseUrl}/filterServices/${idHost}`);
	}

	_getHistorics(idService: string) {
		return this.http.get(`${baseUrl}/filterHistorics/${idService}`);
	}

	private _getAlarmsNotifiers() {
		return this.http.get(`${baseUrl}/notifiers`);
	}

	private _getcounterHosts() {
		return this.http.get(`${baseUrl}/counterHosts`);
	}

	getHostImage(filePath: string) {
		return `${baseUrl}/host/hostImage?filePath=${filePath}`;
	}

	updateHostImage(data: any, hostId: any) {
		return this.http.put(`${baseUrl}/host/hostImage/${hostId}`, data);
	}

	getQueriedHostServices(queries: Query[] | undefined = undefined) {
		console.log('host queries', queries);
		let url = `${baseUrl}/host`;
		if (queries == undefined) return this.http.get(url);

		for (let q of queries) {
			url = this.addquery(url, q);
			console.log(url);
		}
		return this.http.get(url);
	}
	addquery(url: string, query: Query) {
		if (!url.includes('?')) url += '?';
		else url += '&';
		url += `${query.name}=${query.value}`;
		return url;
	}

	getDevices() {
		return this.http.get(`${baseUrl}/devices`);
	}

	getTypeHosts() {
		return this.http.get(`${baseUrl}/typeHosts`);
	}

	getAlarmsByWeek(hostname: any) {
		return this.http.get(`${baseUrl}/weekAlarms/${hostname}`);
	}

	getHostServices(hostId: number) {
		let url = `${baseUrl}/host/${hostId}`;
		return this.http.get(url);
	}
}
