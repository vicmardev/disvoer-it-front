import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {User} from '../models/User';
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';
import {NONE_TYPE} from '@angular/compiler';
import {Role} from '../models/role';

const AUTH_URL = `${environment.apiUrl}/accounts`;

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private refreshTokenTimeout: any;
	public currentUserSubject: BehaviorSubject<any>;
	public currentUser: Observable<User>;
	constructor(private http: HttpClient, private router: Router) {
		this.currentUserSubject = new BehaviorSubject<User>(
			JSON.parse(localStorage.getItem('currentUser') || '{}') as any
		);
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): any {
		const userJson = JSON.stringify(this.currentUserSubject.value);
		if (userJson == '{}') {
			return null;
		}

		return this.currentUserSubject.value;
	}

	login(email: string, password: string): Observable<any> {
		return this.http
			.post<any>(
				`${AUTH_URL}/authenticate`,
				{
					email,
					password,
				},
				{withCredentials: true}
			)
			.pipe(
				map(user => {
					localStorage.setItem('currentUser', JSON.stringify(user));
					this.currentUserSubject.next(user);
					this.startRefreshTimer();
					return user;
				})
			);
	}

	logout() {
		this.http
			.post<any>(`${AUTH_URL}/revoke-token`, {}, {withCredentials: true})
			.subscribe();
		this.currentUserSubject.next(null);
		localStorage.removeItem('currentUser');

		this.router.navigate(['/login/login']);
		this.stopRefreshTimer();
	}

	refreshToken() {
		return this.http
			.post<any>(`${AUTH_URL}/refresh-token`, {}, {withCredentials: true})
			.pipe(
				map(user => {
					this.currentUserSubject.next(user);
					this.startRefreshTimer();
					return user;
				})
			);
	}

	register(params: any) {
		return this.http.post(`${AUTH_URL}/register`, params);
	}

	verifyEmail(token: String, email: String) {
		return this.http.post(`${AUTH_URL}/verify-email`, {email, token});
	}

	forgotPassword(email: string) {
		return this.http.post(`${AUTH_URL}/forgot-password`, {email});
	}

	validateResetToken(token: string) {
		return this.http.post(`${AUTH_URL}/validate-reset-token`, {token});
	}

	resetPassword(token: string, password: string, confirmPassword: string) {
		return this.http.post(`${AUTH_URL}/reset-password`, {
			token,
			password,
			confirmPassword,
		});
	}

	startRefreshTimer() {
		const userJWT = this.currentUserValue.jwtToken?.split('.')[1];
		if (userJWT) {
			const jwt = JSON.parse(atob(userJWT));
			//resetToken 60 seconds before expiration
			const expires = new Date(jwt.exp * 1000);
			const timeout = expires.getTime() - Date.now() - 60 * 1000;
			this.refreshTokenTimeout = setTimeout(
				() => this.refreshToken().subscribe(),
				timeout
			);
		}
	}

	stopRefreshTimer() {
		clearTimeout(this.refreshTokenTimeout);
	}
}
