import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import {AuthService} from 'src/app/auth/auth.service';
import {User} from 'src/app/models/User';
import {environment} from 'src/environments/environment';

const baseUrl = `${environment.apiUrl}/discovery`;
const discoveyUrl = `${environment.discoveryApi}/api/v1`;

@Injectable({
	providedIn: 'root',
})
export class DiscoveryService {
	constructor(private router: Router, private _http: HttpClient) {}

	getTypePartsName() {
		return this._http.get(`${baseUrl}/getTypePartsName`);
	}

	getChasis(data: any) {
		return this._http.post(`${discoveyUrl}/chasis/devices`, data);
	}

	getComponentsChasis(id: any) {
		return this._http.get(`${baseUrl}/componentChasis/${id}`);
	}
}
