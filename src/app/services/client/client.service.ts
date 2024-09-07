import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';

const baseUrlClients = `${environment.apiUrl}/client`;

@Injectable({
	providedIn: 'root',
})
export class ClientService {
	constructor(private http: HttpClient) {}

	getClientsList() {
		return this.http.get(`${baseUrlClients}/clients`);
	}

	createClient(data: any) {
		for (let key of Object.keys(data)) {
			console.log(data[key]);
		}
		return this.http.post(`${baseUrlClients}/createClients`, data);
	}

	editClient(data: any) {
		for (let key of Object.keys(data)) {
			console.log(data[key]);
		}
		return this.http.put(`${baseUrlClients}/editClient`, data);
	}

	deleteClient(data: any) {
		console.log('Data ', data);

		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.put(`${baseUrlClients}/updateClientStatus`, formData);
	}
}
