import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from 'src/app/auth/auth.service';
import {User} from 'src/app/models/User';
import {environment} from 'src/environments/environment';
import {ScriptData} from 'src/app/models/script-data';
import {IContract} from 'src/app/models/IContract';

const baseUrl = `${environment.apiUrl}/inventario`;
const URL = `${environment.updateContractsUrl}`;

@Injectable({
	providedIn: 'root',
})
export class InventoryService {
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
	getAll() {
		return this.http.get(baseUrl);
	}
	getContract(contract: String) {
		return this.http.get(`${baseUrl}?contract=${contract}`);
	}

	getAllContracts() {
		return this.http.get<IContract[]>(`${baseUrl}/contracts`);
	}

	getAllUser(contrato: any) {
		return this.http.get(`${baseUrl}/user/${contrato}`);
	}

	getStatusLis(section: any) {
		console.log('El valor de section es: ', section);
		return this.http.get(`${baseUrl}/statusList?section=${section}`);
	}

	getAddressByCp(cp: any) {
		return this.http.get(`${baseUrl}/adress?cp=${cp}`);
		//https://apisgratis.com/cp/colonias/cp/?valor=${cp}
	}

	deleteRowId(id: any, comments: any, user: any) {
		return this.http.delete(`${baseUrl}/${id}/${comments}/${user}`);
	}
	//
	setContractStatus(id: string, status: string, data: any) {
		console.log('Data', data);
		console.log('Status', status);
		return this.http.put(`${baseUrl}/contracts/${id}/${status}`, data);
	}

	updateRowId(id: any, data: any) {
		return this.http.put(`${baseUrl}/${id}`, data);
	}

	createRowEquipment(data: any) {
		return this.http.post(`${baseUrl}/`, data);
	}

	importExcelFile(file: any, token: string) {
		const formData = new FormData();
		formData.append('upload_file', file, file.name);
		formData.append('token', token);
		const reqHeaders = new HttpHeaders();
		reqHeaders.set('Content-Type', 'multipart/form-data');
		reqHeaders.set('Accept', 'application/json');
		return this.http.post<any>(`${baseUrl}/contracts/import`, formData, {
			headers: reqHeaders,
		});
	}

	checkContracts(file: any, token: string) {
		let formData = new FormData();
		formData.append('contracts_file', file, file.name);
		formData.append('token', token);
		let myHeaders = new HttpHeaders();
		myHeaders.set('Content-Type', 'multipart/form-data');
		myHeaders.set('Accept', 'application/json');
		return this.http.post<any>(`${baseUrl}/contracts/check`, formData, {
			headers: myHeaders,
		});
	}

	runCommands(data: ScriptData) {
		return this.http.post<any>(`${URL}/run-scripts`, data);
	}

	getAllInfoContract(idContract: any) {
		return this.http.get(`${baseUrl}/contracts/${idContract}`);
	}

	getBrandById(idBrand: number){
		return this.http.get(`${baseUrl}/getBrandById/${idBrand}`);
	}

	getSupportOperators() {
		return this.http.get(`${baseUrl}/operators`);
	}

	setBudget(data: any) {
		return this.http.post<any>(`${baseUrl}/createBudget`, data);
	}

	getCurrency() {
		return this.http.get(`${baseUrl}/getCurrency`);
	}

	searchContract(IdContract: any) {
		return this.http.get(`${baseUrl}/searchContract/${IdContract}`);
	}

	getContractDetails() {
		return this.http.get(`${baseUrl}/tableBuilder`);
	}

	getContractEngineersById(IdContract: any) {
		return this.http.get(`${baseUrl}/engineers/${IdContract}`);
	}

	deleteEngineerCE(data: any) {
		return this.http.delete(
			`${baseUrl}/deleteEngineer/${data.IdContract}/${data.IdEngineer}`
		);
	}

	getAvailableEngineers(data: any) {
		return this.http.post(`${baseUrl}/availableEngineers`, data);
	}

	setContractEngineers(data: any) {
		return this.http.post(`${baseUrl}/setContractEngineers`, data);
	}

	updateDataCenterEquipment(id: number, data: any) {
		return this.http.put(`${baseUrl}/dataCenterEquipment/${id}`, data);
	}
	getSlaById(id: number){
		return this.http.get(`${baseUrl}/getSlaById/${id}`)
	}
}
