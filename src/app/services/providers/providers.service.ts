import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';

const baseURLProviders = `${environment.apiUrl}/provider`;

@Injectable({
	providedIn: 'root',
})
export class ProvidersService {
	constructor(private http: HttpClient) {}

	getProvidersList() {
		return this.http.get(`${baseURLProviders}/getAllproviders`);
	}

	createProvider(data: any) {
		for (let key of Object.keys(data)) {
			console.log(data[key]);
		}
		return this.http.post(`${baseURLProviders}/createProvider`, data);
	}

	deleteProvider(data: any) {
		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.put(`${baseURLProviders}/updateProviderStatus`, formData);
	}

	editProvider(data: any) {
		for (let key of Object.keys(data)) {
			console.log(data[key]);
		}
		return this.http.put(`${baseURLProviders}/editProvider`, data);
	}
}
