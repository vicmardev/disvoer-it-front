import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from 'src/app/models/User';
import {AuthService} from 'src/app/auth/auth.service';
import {environment} from 'src/environments/environment';
import {Parts} from 'src/app/models/partsWerehouse';
import {Tickets} from 'src/app/models/Tickets';

const baseUrl = `${environment.apiUrl}/parts-werehouse`;

@Injectable({
	providedIn: 'root',
})
export class PartsWerehouseService {
	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService
	) {}

	getAllParts() {
		return this.http.get(`${baseUrl}/v2`);
	}

	getPartsByStatus(status: string) {
		return this.http.get(`${baseUrl}?status=${status}`);
	}

	createPart(data: any) {
		for (let key of Object.keys(data)) {
		}
		return this.http.post(`${baseUrl}`, data);
	}

	createOperationPart(data: any) {
		return this.http.post(`${baseUrl}/v2/${data.OperationPart.SerialNumber}`, data);
	}

	newPart(data: any) {
		return this.http.put(`${baseUrl}/v2/`, data);
	}

	updatePart(x: any) {
		return x;
	}

	subtractPart(serial: any) {
		return this.http.put(`${baseUrl}/${serial}`, '');
	}

	sendEmail(formTakePart: any) {
		return this.http.post(`${baseUrl}/contact-storer`, formTakePart);
	}

	checkParts(file: any, token: string) {
		const formData = new FormData();
		formData.append('parts_file', file);
		formData.append('token', token);
		const headers = new HttpHeaders();
		headers.set('Content-Type', 'multipart/form-data');
		headers.set('Accept', 'application/json');
		return this.http.post<any>(`${baseUrl}/check`, formData, {headers: headers});
	}

	addParts(file: any, token: string) {
		const formData = new FormData();
		formData.append('parts_file', file);
		formData.append('token', token);
		const headers = new HttpHeaders();
		headers.set('Content-Type', 'multipart/form-data');
		headers.set('Accept', 'application/json');
		return this.http.post<any>(`${baseUrl}/addParts`, formData, {headers: headers});
	}

	getRelatedPartsOld(part: Parts) {
		return this.http.get<Parts>(
			`${baseUrl}/relatedParts?brand=${part.brand}&model=${part.model}&part=${part.part}&partNumber=${part.partNumber}`
		);
	}

	getRelatedParts(part: any) {
		return this.http.get<any>(`${baseUrl}/v2/relatedParts?Id=${part.IdPart}`);
	}

	getAvailableParts(ticket: any) {
		return this.http.get<Parts>(
			`${baseUrl}/availableParts?brand=${ticket.brand}&model=${ticket.model}&part=${ticket.equipment}&partNumber=${ticket.affectationPart}`
		);
	}

	assignPart(id: any, data: any) {
		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}

		return this.http.put(`${baseUrl}/assingPart/${id}`, formData);
	}

	getPartField(field: string = 'partType') {
		return this.http.get(`${baseUrl}/partTypes?field=${field}`);
	}
	notifyNoAvailableParts(part: any) {
		return this.http.get(
			`${baseUrl}/notifyNoAvailableParts?brand=${part.brand}&model=${part.model}&part=${part.part}&partNumber=${part.partNumber}`
		);
	}
}
