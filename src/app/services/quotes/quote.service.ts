import {HttpClient} from '@angular/common/http';
import {Quote} from '@angular/compiler';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';

const baseUrl = `${environment.apiUrl}/quote`;

@Injectable({
	providedIn: 'root',
})
export class QuoteService {
	constructor(private router: Router, private http: HttpClient) {}

	createQuote(data: Quote) {
		return this.http.post(`${baseUrl}`, data);
	}

	updateQuote(id: number, data: Quote) {
		return this.http.put(`${baseUrl}/${id}`, data);
	}

	getAllQuotes() {
		return this.http.get(`${baseUrl}`);
	}

	getQuoteById(id: number) {
		return this.http.get(`${baseUrl}/${id}`);
	}

	getSelectors() {
		return this.http.get(`${baseUrl}?selector=customers`);
	}

	deleteQuote(id: number) {
		return this.http.delete(`${baseUrl}/${id}`);
	}
}
