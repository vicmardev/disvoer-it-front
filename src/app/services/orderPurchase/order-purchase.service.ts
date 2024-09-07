import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from 'src/app/auth/auth.service';
import {User} from 'src/app/models/User';
import {environment} from 'src/environments/environment';

const baseURL = `${environment.apiUrl}/order-purchase`;
const baseURLStatus = `${environment.apiUrl}/inventario`;
const baseUrlClients = `${environment.apiUrl}/client`;

@Injectable({
	providedIn: 'root',
})
export class OrderPurchaseService {
	private userSubject!: BehaviorSubject<User>;
	public user!: Observable<User>;
	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService
	) {}

	public get userValue(): User {
		return this.authService.currentUserValue;
	}

	createOrder(data: any, file: any) {
		console.log('Valor de data: ', data);
		console.log('Valor de file:', file);
		const formData = new FormData();
		formData.append('UrlOrderFile', file, file.name);
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.post(`${baseURL}`, formData, file);
	}

	updateOrder(data: any) {
		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.put(`${baseURL}/updateOrder`, formData);
	}

	editOrder(data: any) {
		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.put(`${baseURL}/editOrder`, formData);
	}

	deleteOrder(data: any) {
		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.put(`${baseURL}/deleteOrder`, formData);
	}

	getAllOrder() {
		return this.http.get(`${baseURL}/getAllOrder`);
	}

	getStatusList(section: any) {
		return this.http.get(`${baseURLStatus}/statusList?section=${section}`);
	}

	getClientsList() {
		return this.http.get(`${baseUrlClients}/clients`);
	}

	getBrandsList() {
		return this.http.get(`${baseURL}/getBrands`);
	}

	getTypeList() {
		return this.http.get(`${baseURL}/getTypeParts`);
	}

	getFile(filePath: string) {
		return this.http.get(`${baseURL}?filePath=${filePath}`, {
			responseType: 'arraybuffer',
		});
	}

	getHistory(numOrder: number) {
		return this.http.get(`${baseURL}/getHistory/${numOrder}`);
	}
}
