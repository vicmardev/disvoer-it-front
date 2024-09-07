import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';

const baseUrlSupportOperator = `${environment.apiUrl}/support`;

@Injectable({
	providedIn: 'root',
})
export class SupportOperatorsService {
	constructor(private http: HttpClient) {}

	getSupportOperatorList() {
		return this.http.get(`${baseUrlSupportOperator}/support`);
	}

	createSupportOperator(data: any) {
		for (let key of Object.keys(data)) {
			console.log(data[key]);
		}
		return this.http.post(`${baseUrlSupportOperator}/createSupportOperator`, data);
	}

	deleteSupportOperator(data: any) {
		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.put(`${baseUrlSupportOperator}/updateOperatorStatus`, formData);
	}

	getLevels() {
		return this.http.get(`${baseUrlSupportOperator}/getNameLevel`);
	}

	editOperator(data: any) {
		for (let key of Object.keys(data)) {
			console.log(data[key]);
		}
		return this.http.put(`${baseUrlSupportOperator}/editOperator`, data);
	}
}
