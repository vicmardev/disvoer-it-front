import {HttpClient} from '@angular/common/http';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import * as L from 'leaflet';
import {ICity} from 'src/app/models/ICity';
import {ICountry} from 'src/app/models/ICountry';
import {MapService} from 'src/app/services/maps/map.service';

interface Country extends ICountry {
	GeoJSON: any;
	NumCities: number;
	NumContracts: number;
	NumDataCenters: number;
	NumEquipments: number;
	Cities: ICity[];
	IsExpanded: boolean;
}

interface IBreadcrumb {
	name: string;
	state: string;
	callback: Function;
}

/*
export class DataMarker extends L.Marker {
	data: any;

	constructor(latLng: L.LatLngExpression, data: any, options?: L.MarkerOptions) {
		super(latLng, options);
		this.setData(data);
	}

	getData() {
		return this.data;
	}

	setData(data: any) {
		this.data = data;
	}

	onMouseover(fn: any): void {
		super.on('mouseover', fn);
	}

	onMouseout(fn: any): void {
		super.on('mouseout', fn);
	}
}
*/

export class Breadcrumbs {
	private crumbs: IBreadcrumb[] = [];

	constructor() {}

	add(name: string, callback: Function) {
		// Disable previous crumbs
		if (this.getSize() >= 1) {
			this.crumbs.map(crumb => (crumb.state = 'enabled'));
		}
		this.crumbs.push({name: name, callback: callback, state: 'disabled'});
	}

	remove() {
		if (this.getSize() > 1) {
			this.crumbs.pop();
		}
		// Set last crumb as disabled
		this.crumbs[this.getSize() - 1].state = 'disabled';
	}

	getCrumbs() {
		return this.crumbs;
	}

	getSize() {
		return this.crumbs.length;
	}
}

@Component({
	selector: 'app-location-contractss',
	templateUrl: './location-contracts.component.html',
	styleUrls: ['./location-contracts.component.scss'],
})
export class LocationContractsComponent implements AfterViewInit {
	private map: any;

	public breadcrumbs = new Breadcrumbs();

	public countries: Country[] = [];
	public groupLayers: any;

	//mapIsLocked: boolean = true;

	private municipalityMap: L.Map | null = null;

	mapLayers: any = [];
	municipalityGeoLayer: any;
	private markersLayer: any;

	contractsInfo: any = [];

	private div: HTMLElement;

	private stateContractCard: HTMLElement;

	private stateContractedFill = '#0C4464';
	private stateContractedBorder = 'white';

	/*
	private mapGeometryStyle = (feature: any) => {
		const stateCode = feature.properties.state_code;
		return {
			fillColor: stateCode in this.contractsInfo ? this.stateContractedFill : 'none',
			color: this.stateContractedBorder,
			opacity: 1,
			weight: 1,
		};
	};

	statesMapOptions = {
		layers: [
			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				minZoom: 5,
				maxZoom: 20,
				attribution:
					'© Colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}),
		],
		zoom: 10,
		center: L.latLng(19.4978, -99.1269),
	};
*/
	markerIcon = L.icon({
		iconUrl: '../../../assets/img/VIRWO.png',
		iconSize: [43, 24],
		shadowSize: [32, 18],
	});

	options = {
		layers: [
			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				minZoom: 3,
				maxZoom: 20,
				attribution:
					'© Colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}),
		],
		zoom: 3,
		center: L.latLng(23.634501, -102.5527849),
	};

	constructor(private http: HttpClient, private service: MapService) {
		this.breadcrumbs.add('Map', () => {
			console.log('click in map');
		});

		this.div = L.DomUtil.create('div', 'info');
		this.stateContractCard = L.DomUtil.create('div', 'info');
	}

	layerInfo: any[] = [];

	ngAfterViewInit(): void {
		L.latLng(19.4978, -99.1269),
			(this.map = L.map('contractsMap', {center: [39.8282, -98.5795], zoom: 3}));

		const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			minZoom: 3,
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		});

		tiles.addTo(this.map);

		this.initialLoadData();

		/*
		let menuBreadcrumb: Breadcrumb = {
			state: 'active',
			name: 'MAP',
			//link: event:any => {
			///	event.stopPropagation();
			//	console.log('menu');
			},
		};*/

		//this.pushBreadcrumb(menuBreadcrumb);

		// Country Select

		// State  Select
		/*
		this.http.get('../../../assets/json/mexico_states.json').subscribe((json: any) => {
			this.countryMapLayer.push(
				geoJSON(json, {
					style: this.mapGeometryStyle,

					onEachFeature: (feature, layer) => {
						let stateCode = feature.properties.state_code;
						let stateName = feature.properties.state_name;

						if (stateCode in this.contractsInfo) {
							layer.on('click', e => {
								this.showContractsPerMunicipality(stateCode);
							});
							layer.on('mouseout', e => {
								e.target.setStyle({
									fillColor: '#0C4464',
								});
								this.updateCountryInfoPanel(0, '');
							});
							layer.on('mouseover', e => {
								e.target.setStyle({
									fillColor: '#ff0000',
								});
								this.updateCountryInfoPanel(stateCode, stateName);
							});
						}
					},
				})
			);
		});

    */

		//this.map?.on('load', () => {
		//	console.log('map loaded');
		//});

		// Adjust map size on load
		window.dispatchEvent(new Event('resize'));
	}

	private async initialLoadData() {
		await this.loadCountriesData();
		this.showCountriesLayer();
		//this.load;
	}

	add() {
		const count = this.breadcrumbs.getSize() + 1;
		this.breadcrumbs.add(`Elemento ${count}`, () => {
			console.log(`click en elemento ${count}`);
		});
	}

	remove() {
		this.breadcrumbs.remove();
	}

	/*
	changeFlag() {
		this.mapIsLocked = false;
	}
  */

	onMapReady(map: L.Map) {
		console.log('map', this.countries);

		//this.map = map;

		//this.initialLoadData();
		//this.updateMap();

		//const contractDetailsPanel = new Control();

		/*
		contractDetailsPanel.onAdd = map => {
			this.updateCountryInfoPanel(0, '');
			return this.div;
		};

		contractDetailsPanel.addTo(this.map);\
    */
	}

	private updateMap() {
		//	if (this.mapLayers) this.map?.removeLayer(this.mapLayers);
		this.drawLayer();
	}

	private drawLayer() {
		this.showCountriesLayer();

		//this.updateSideBarPanel();
	}

	private async showCountriesLayer() {
		const countries = this.countries;
		const countriesLayers = [];

		for (let country of countries) {
			country.IsExpanded = false;

			let countryLayer: any;
			const _this = this;

			countryLayer = L.geoJSON(country.GeoJSON, {
				onEachFeature: function (feature, layer) {
					layer.on({
						mouseover: function (e) {
							_this.selectCountry(country.IdCountry);

							for (let c of countries) {
								c.IsExpanded = false;
							}
							country.IsExpanded = true;
						},
						/*
						mouseout: function (e) {
							e.target.setStyle({
								fillColor: '#3388ff',
							});
						},*/
					});
				},
			});

			countryLayer.id = country.IdCountry;
			countriesLayers.push(countryLayer);
		}

		this.groupLayers = L.layerGroup(countriesLayers);

		this.groupLayers.addTo(this.map);

		this.groupLayers.eachLayer(function (layer: any) {
			//layer.setStyle({fillColor: 'redd'});
		});
	}

	expandToggle(country: Country) {
		if (!country.IsExpanded) {
			country.IsExpanded = true;
			this.selectCountry(country.IdCountry);
		} else {
			country.IsExpanded = false;
			this.resetHighlightCountry();
		}
		for (let c of this.countries) {
			if (c != country) {
				c.IsExpanded = false;
			}
		}
		console.log('expand');
	}

	private selectCountry(countryId: Number) {
		this.groupLayers.eachLayer(function (layer: any) {
			if (layer.id == countryId) {
				layer.setStyle({fillColor: '#D9AE5B'});
			} else {
				layer.setStyle({fillColor: '#3388ff'});
			}
		});
	}

	private resetHighlightCountry() {
		this.groupLayers.eachLayer(function (layer: any) {
			layer.setStyle({fillColor: '#3388ff'});
		});
	}

	private async loadCountriesData() {
		const countriesResult = await this.service.getCountriesWithContracts().toPromise();
		if (countriesResult.status) {
			this.countries = countriesResult.data as Country[];

			for (const country of this.countries) {
				country.IsExpanded = false;
				const geoJSONResult = await this.service
					.getCountryGeoJSON(country.IdCountry)
					.toPromise();

				if (geoJSONResult.status) {
					country.GeoJSON = geoJSONResult.data;
				}
			}
		}
	}

	private updateSideBarPanel() {}

	/*
	onStatesMapReady(map: L.Map) {
		this.municipalityMap = map;

		const contractCard = new L.Control();

		contractCard.onAdd = map => {
			this.updateMunicipalitiesCard({});
			return this.stateContractCard;
		};

		contractCard.addTo(this.municipalityMap);
	}
/*
	updateCountryInfoPanel = (stateCode: number, stateName: string) => {
		let html = '';

		if (stateCode > 0) {
			html += `<h3>${stateName}</h3>`;
			const contractsForState = this.contractsInfo[stateCode];
			contractsForState.forEach((contract: any) => {
				html += this.contractInfo(contract);
			});
		} else {
			html =
				'<h3 style="color:#0c4464cf;font-style: oblique; ">Selecciona  un estado.</h3>';
		}
		this.div.innerHTML = html;
	};

  /*
	updateMunicipalitiesCard = (contract: any) => {
		if (Object.keys(contract).length !== 0) {
			this.stateContractCard.innerHTML = '<br>' + this.contractInfo(contract);
		} else {
			this.stateContractCard.innerHTML = '';
		}
	};

  /*
	showContractsPerMunicipality(stateCode: number) {
		this.service.getMunicipalitiesPerState(stateCode).subscribe((json: any) => {
			if (this.municipalityGeoLayer) {
				this.municipalityMap?.removeLayer(this.municipalityGeoLayer);
				this.municipalityMap?.removeLayer(this.markersLayer);
			}

			this.municipalityGeoLayer = L.geoJSON(json, {
				style: this.mapGeometryStyle,
			});
			this.municipalityMap?.addLayer(this.municipalityGeoLayer);
			this.showMarkersLayer(stateCode);
			this.municipalityMap?.flyTo([json.lat, json.lon], json.zoom);
		});
	}

	/*
	showMarkersLayer(stateCode: number) {
		this.markersLayer = L.layerGroup();

		this.contractsInfo[stateCode].forEach((contract: any) => {
			const m = new DataMarker([contract.lat, contract.lon], contract, {
				icon: this.markerIcon,
			});
			m.onMouseover((e: any) => {
				this.updateMunicipalitiesCard(e.target.data);
			});

			m.onMouseout((e: any) => {
				console.log('onmouseout');
				this.updateMunicipalitiesCard({});
			});

			this.markersLayer.addLayer(m);
		});

		this.municipalityMap?.addLayer(this.markersLayer);
	}

	private contractInfo(contract: any) {
		return `<span class="contrato-details">Contrato: </span> ${contract.id}<br><span class="contrato-details">No. de equipos: </span> ${contract.equipment}<br><br>`;
	}
  */
}
