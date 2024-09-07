import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {IQueryResult} from 'src/app/models/IQueryResult';

const baseUrl = `${environment.apiUrl}/map-geolocations`;

@Injectable({
	providedIn: 'root',
})
export class MapService {
	constructor(private http: HttpClient) {}

	getCountriesWithContracts() {
		return this.http.get<IQueryResult>(`${baseUrl}/countries/`);
	}

	getCountryGeoJSON(countryCode: number) {
		return this.http.get<IQueryResult>(`${baseUrl}/countrygeo/${countryCode}`);
	}

	getMunicipalitiesPerState(stateCode: Number) {
		return this.http.get(`${baseUrl}/municipalities/${stateCode}`);
	}
}
