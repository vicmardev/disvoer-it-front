import {AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {AuthService} from 'src/app/auth/auth.service';
import {Role} from 'src/app/models/role';
import {User} from 'src/app/models/User';
import {AccountService} from 'src/app/services/account/account.service';
import {environment} from 'src/environments/environment';
import {MatBadgeModule} from '@angular/material/badge';
import {BehaviorSubject} from 'rxjs';
import {ReportsService} from '../../services/reports/reports.service';
import {TicketsService} from '../../services/tickets/tickets.service';
import {calendarEvent} from '../../models/calendar-events';
import {GraphicService} from '../../services/graphic/graphic.service';
import {operatorNotifier} from '../../models/operator-notifier';
import {alarmIconNotification} from '../../models/alarm-icon-notification';
import {ThemePalette} from '@angular/material/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	showAdminMenu: boolean = false;
	showHistorical: boolean = false;
	showTicketsMenu: boolean = false;
	showFaqs: boolean = false;
	showAlerts: boolean = false;
	showContracts: boolean = false;
	Role = Role;
	nameUser!: User;
	imgUrl: string = '';
	AvatarImgUrl = `${environment.ticketImgUrl}/`;
	activeRoutePath: string = '';

	// Vars to notifications icon
	okCount: number = 0;
	warningCount: number = 0;
	criticalCount: number = 0;
	unknownCount: number = 0;
	totalAlarmCount: number = 0;
	public okAlarms: BehaviorSubject<any> = new BehaviorSubject(0);
	public critAlarms: BehaviorSubject<any> = new BehaviorSubject(0);
	public warnAlarms: BehaviorSubject<any> = new BehaviorSubject(0);
	public unknownAlarms: BehaviorSubject<any> = new BehaviorSubject(0);
	allpie = [this.okAlarms.value, this.warnAlarms.value, this.critAlarms.value];
	private alarmSub: any;
	serviceAlarms!: any;
	public alarmIconNotifications: alarmIconNotification[] = [];

	color: ThemePalette = 'warn';
	mode: ProgressBarMode = 'determinate';
	bufferValue = 75;

	// Vars to mail icon

	totalMailCount: number = 0;
	operatorNotifiers!: operatorNotifier[];
	userRole!: User;
	userKind: boolean = false;
	serviceAlarmsUsers!: any;
	userTicketsCount: number = 0;

	counterSub: any;
	public userTickets: BehaviorSubject<any> = new BehaviorSubject(0);

	private alarms: any;

	getOperatorsTickets() {
		this.counterSub =
			this.user.role == 'User' ? this.usersCounterTickets() : this.adminCounterTickets();
	}

	adminCounterTickets() {
		let sub = this._ticketService.getServiceTicketAlerts().subscribe(res => {
			this.operatorNotifiers = res;
			this.totalMailCount = 0;
			for (let op in this.operatorNotifiers) {
				this.totalMailCount += parseInt(this.operatorNotifiers[op].tickets);
			}
		});
		return sub;
	}

	usersCounterTickets() {
		let sub = this._ticketService.getServiceTicketAlerts().subscribe(res => {
			this.serviceAlarmsUsers = res;
			this.totalMailCount = this.serviceAlarmsUsers.filter(
				(w: any) => w.name == `${this.user.firstName} ${this.user.lastName}`
			).length;
			this.userTickets.next(this.totalMailCount);
			console.log('Soy usuario y mi correo es: ', this.user.email);
		});
		return sub;
	}

	getNotifiersAlarms() {
		this.alarms = this._reportService.getAlarmsNotifiers().subscribe(res => {
			for (let i in res) {
				let expression = res[i].Status;
				switch (expression) {
					case 'ok': {
						this.okCount = res[i].total;
						break;
					}
					case 'warning': {
						this.warningCount = res[i].total;
						break;
					}
					case 'critical': {
						this.criticalCount = res[i].total;
						break;
					}
					default: {
						break;
					}
				}
			}
		});
	}

	/* sidenav */
	/*  isExpanded: boolean = false; */

	constructor(
		private _ticketService: TicketsService,
		private _reportService: ReportsService,
		private _router: Router,
		private authService: AuthService,
		private _activatedRoute: ActivatedRoute,
		iconRegistry: MatIconRegistry,
		sanitizer: DomSanitizer
	) {
		iconRegistry.addSvgIcon(
			'ip-icon',
			sanitizer.bypassSecurityTrustResourceUrl('assets/icons/IP.svg')
		);
	}

	ngOnInit(): void {
		this.getNotifiersAlarms();
		this.imgUrl =
			this.user.role == 'User'
				? 'https://amzucapacitacion.com/wp-content/uploads/2021/06/avatar-4.png'
				: 'https://cdn1.iconfinder.com/data/icons/people-49/512/_nerd_man-512.png';

		// Get title on page construction
		this.activeRoutePath = this._router.url;

		// Get title on route change
		this._router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.activeRoutePath = this._router.url;
			}
		});

		/* setTimeout(() => {
			this.getServiceAlarms();
			this.getOperatorsTickets();
		}); */
	}

	get user() {
		this.nameUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as any;
		return this.nameUser;
	}

	logout() {
		//this._router.navigateByUrl('login/login');
		this.authService.logout();
		console.warn('Test de logout');
	}
	goToProfile() {
		this._router.navigateByUrl('dash/profile');
	}
	alertWarning() {
		this._router.navigateByUrl('dash/alerts/warning');
	}
	alertCritical() {
		this._router.navigateByUrl('dash/alerts/critical');
	}

	/* ngOnDestroy() {
		this.alarmSub.unsubscribe();
		this.counterSub.unsubscribe();
	} */
}
