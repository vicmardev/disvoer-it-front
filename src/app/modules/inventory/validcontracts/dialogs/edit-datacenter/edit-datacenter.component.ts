import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ICity} from 'src/app/models/ICity';
import {ICountry} from 'src/app/models/ICountry';
import {IQueryResult} from 'src/app/models/IQueryResult';
import {ContractsService} from 'src/app/services/contracts/contracts.service';

@Component({
	selector: 'app-edit-datacenter',
	templateUrl: './edit-datacenter.component.html',
	styleUrls: ['./edit-datacenter.component.scss'],
})
export class EditDatacenterComponent implements OnInit {
	public formEditDataCenter = this.formBuilder.group({
		IdCountry: [''],
		IdCity: [''],
		Delegation: [''],
		Neighborhood: [''],
		PostalCode: [''],
		Street: [''],
		ExternalNumber: [''],
		InternalNumber: [''],
	});
	public countriesList: ICountry[] = [];
	public citiesList: ICity[] = [];
	public countrySelected: number = 0;
	public citySelected: number = 0;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private contractsService: ContractsService,
		private dialogRef: MatDialogRef<any>,
		private formBuilder: FormBuilder,
		private snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.loadInfo();
		this.getValuesFrom();
	}

	private async loadInfo() {
		this.getCountriesList();

		this.countriesList = await this.getCountriesList();
		this.countrySelected = this.data.dataCenter.IdCountry;

		this.citiesList = await this.getCitiesList(this.data.dataCenter.IdCountry);
		this.citySelected = this.data.dataCenter.IdCity;
	}

	async getValuesFrom() {
		this.formEditDataCenter.controls['Delegation'].setValue(
			this.data.dataCenter.Delegation
		);
		this.formEditDataCenter.controls['Neighborhood'].setValue(
			this.data.dataCenter.Neighborhood
		);
		this.formEditDataCenter.controls['PostalCode'].setValue(
			this.data.dataCenter.PostalCode
		);
		this.formEditDataCenter.controls['Street'].setValue(this.data.dataCenter.Street);
		this.formEditDataCenter.controls['ExternalNumber'].setValue(
			this.data.dataCenter.ExternalNumber
		);
		this.formEditDataCenter.controls['InternalNumber'].setValue(
			this.data.dataCenter.InternalNumber
		);
	}

	cancel() {
		this.dialogRef.close();
	}

	update() {
		const errorMsg = 'Error al actualizar el datacenter';
		const sucessMsg = 'Actualización de datos exitosa';

		this.formEditDataCenter.controls['IdCountry'].setValue(this.countrySelected);
		this.formEditDataCenter.controls['IdCity'].setValue(this.citySelected);

		this.contractsService
			.editDataCenter(this.data.dataCenter.IdDataCenter, this.formEditDataCenter.value)
			.subscribe((result: IQueryResult) => {
				if (result.status) {
					// Get first city that matches

					this.data.dataCenter.CityName = this.citiesList.filter((city: ICity) => {
						return city.IdCity === this.citySelected;
					})[0].State;

					// Get first city that matches
					this.data.dataCenter.CountryName = this.countriesList.filter(
						(country: ICountry) => {
							return country.IdCountry === this.countrySelected;
						}
					)[0].Name;

					Object.assign(this.data.dataCenter, this.formEditDataCenter.value);
					this.setAddress(this.data.dataCenter);
					this.showSnackbar(sucessMsg, 'message');
				} else {
					this.showSnackbar(errorMsg, 'error');
				}

				this.dialogRef.close(result);
			});
	}

	public async countryChange() {
		this.citiesList = await this.getCitiesList(this.countrySelected);
		this.citySelected = this.citiesList[0].IdCity;
	}

	private async getCountriesList(): Promise<ICountry[]> {
		const countriesResult = (await this.contractsService
			.getAllCountries()
			.toPromise()) as IQueryResult;

		if (!countriesResult.status) {
			this.errorExit(countriesResult.msg);
		}
		return countriesResult.data as ICountry[];
	}

	private async getCitiesList(IdCountry: number): Promise<ICity[]> {
		const citiesResult = (await this.contractsService
			.getAllCitiesForCountry(IdCountry)
			.toPromise()) as IQueryResult;
		if (!citiesResult.status) {
			this.errorExit(citiesResult.msg);
		}

		return citiesResult.data as ICity[];
	}

	private setAddress(datacenter: any) {
		datacenter.Address =
			`${datacenter.Street}` +
			`${datacenter.ExternalNumber ? `, No. ${datacenter.ExternalNumber}` : ''}` +
			`${datacenter.InternalNumber ? `, Int. ${datacenter.InternalNumber}` : ''}` +
			`${datacenter.Neighborhood ? `, ${datacenter.Neighborhood}` : ''}` +
			`${datacenter.Delegation ? `, ${datacenter.Delegation}` : ''}` +
			`${datacenter.PostalCode ? `, C.P. ${datacenter.PostalCode}` : ''}`;
	}

	private errorExit(msg: string) {
		this.showSnackbar(msg, 'error');
		return;
	}

	private showSnackbar(msg: string, type: string = 'message') {
		this.snackBar.open(msg, '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: [type === 'message' ? 'background-snack-info' : 'background-snack-red'],
		});
	}
}
