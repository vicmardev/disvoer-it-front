import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from 'src/app/models/User';
import {AuthService} from 'src/app/auth/auth.service';
import {environment} from 'src/environments/environment';
import {IQueryResult} from 'src/app/models/IQueryResult';
import {IDataCenter} from 'src/app/models/IDataCenter';

const baseUrl = `${environment.apiUrl}/contract`;
const baseUrlClients = `${environment.apiUrl}/client`;
const baseUrlDataCenters = `${environment.apiUrl}/dataCenter`;
const baseUrlInventory = `${environment.apiUrl}/inventario`;

@Injectable({
	providedIn: 'root',
})
export class ContractsService {
	private userSubject!: BehaviorSubject<User>;
	public user!: Observable<User>;
	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService
	) {}

	createContract(data: any) {
		for (let key of Object.keys(data)) {
			console.log(data[key]);
		}
		return this.http.post(`${baseUrl}`, data);
	}

	getCompleteOrder(NumOrder: any) {
		return this.http.get(`${baseUrl}/getCompleteOrder/${NumOrder}`);
	}

	getContractById(id: any) {
		return this.http.get(`${baseUrl}/${id}`);
	}
	
	getContractTimeById(id: any){
		return this.http.get(`${baseUrl}/getContractTimeById/${id}`)
	}

	getAllContracts() {
		return this.http.get(baseUrl);
	}

	getAllClients() {
		return this.http.get(`${baseUrlClients}/clients`);
	}

	getAllDataCenters() {
		return this.http.get(`${baseUrlDataCenters}/getDataCenters`);
	}

	getDataCenterById(id: any) {
		return this.http.get(`${baseUrlDataCenters}/getDataCenterById/${id}`);
	}

	getClientById(id: any) {
		return this.http.get(`${baseUrlInventory}/getClientById/${id}`);
	}

	getDataCentersByData(dataCenter: any) {
		return this.http.get(`${baseUrlDataCenters}/getDataCentersByData/${dataCenter}`);
	}
	updateContract(id: any, data: any) {
		return this.http.put(`${baseUrl}/${id}`, data);
	}

	getAllContractTime() {
		return this.http.get(`${baseUrl}/getAllContractTime`);
	}

	postFilesContracts(data: any, zip: any) {
		const formData = new FormData();
		formData.append('zip_file', zip);
		for (let key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		return this.http.post(`${baseUrl}/response`, formData, zip);
	}

	postEquipments(contractInfo: any, dataCenter: any, data: any) {
		for (let key of Object.keys(data)) {
			console.log(data[key]);
		}
		return this.http.post(`${baseUrlInventory}/contracts/addMultiple`, {
			contractInfo,
			dataCenter,
			data,
		});
	}

	contractsDatacenters() {
		return this.http.get<IQueryResult>(`${baseUrl}/contractsdatacenters`);
	}

	editAlias(contractId: number, data: any) {
		return this.http.put<IQueryResult>(`${baseUrl}/editalias/${contractId}`, data);
	}

	editDataCenter(idDataCenter: number, dataCenter: IDataCenter) {
		return this.http.put<IQueryResult>(
			`${baseUrl}/datacenter/update/${idDataCenter}`,
			dataCenter
		);
	}

	getAllEquipmentsOfDataCenter(IdDataCenter: number) {
		return this.http.get<IQueryResult>(
			`${baseUrl}/datacenter/${IdDataCenter}/equipments`
		);
	}

	getAllSLA() {
		return this.http.get<IQueryResult>(`${baseUrl}/sla`);
	}

	getSlaById(id: number){
		return this.http.get(`${baseUrlInventory}/getSlaById/${id}`)
	}

	getAllCountries() {
		return this.http.get<IQueryResult>(`${baseUrl}/countries`);
	}

	getAllCitiesForCountry(countryCode: number) {
		return this.http.get<IQueryResult>(`${baseUrl}/cities/${countryCode}`);
	}

	editDataCenterEquipment(id: number, data: any) {
		return this.http.put<IQueryResult>(`${baseUrl}/datacenterequipment/${id}`, data);
	}

	saveContractZip(data:any, contractZip:any){
		console.log('data: ', data);
		console.log('contractZip: ', contractZip);
		
		const formData = new FormData();
		formData.append('Test', contractZip,contractZip.size)
		formData.append('NameContract',data)
		return this.http.post(`${baseUrl}/postContractZip`, formData, contractZip)
	}

	importExcelFile(file: any, token: string) {
		const formData = new FormData();
		formData.append('upload_file', file, file.name);
		formData.append('token', token);
		const reqHeaders = new HttpHeaders();
		reqHeaders.set('Content-Type', 'multipart/form-data');
		reqHeaders.set('Accept', 'application/json');
		return this.http.post<any>(`${baseUrl}/import`, formData, {
			headers: reqHeaders,
		});
	}
}
