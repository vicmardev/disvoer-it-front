import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';

const baseURLBrands = `${environment.apiUrl}/brand`;

@Injectable({
	providedIn: 'root',
})
export class BrandsService {
	constructor(private http: HttpClient) {}

	getBrandList() {
		return this.http.get(`${baseURLBrands}/getAllBrands`);
	}

	createBrand(data: any) {
		for (let key of Object.keys(data)) {
			console.log(data[key]);
		}
		return this.http.post(`${baseURLBrands}/createBrand`, data);
	}

	editBrand(data: any) {
		for (let key of Object.keys(data)) {
			console.log(data[key]);
		}
		return this.http.put(`${baseURLBrands}/editBrand`, data);
	}

	deleteBrand(data: any) {
		const formData = new FormData();
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.put(`${baseURLBrands}/updateBrandStatus`, formData);
	}
}
