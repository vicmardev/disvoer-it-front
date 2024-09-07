import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Host} from 'src/app/models/host';
import {Query} from 'src/app/models/query';
import {Service} from 'src/app/models/service';
import {ChangePhotoComponent} from 'src/app/pages/dialogs/change-photo/change-photo.component';
import {ReportsService} from 'src/app/services/reports/reports.service';

interface AlarmCount {
	ok: number;
	warning: number;
	critical: number;
	unknown: number;
}
@Component({
	selector: 'host-card',
	templateUrl: './host-card.component.html',
	styleUrls: ['./host-card.component.scss'],
})
export class HostCardComponent implements OnInit {
	deviceIcons = {
		router: 'fas fa-router',
		switch: 'fas fa-ethernet',
		server: 'fas fa-server',
		firewall: 'fas fa-chimney',
	};

	testIcon = this.deviceIcons['server'];

	status = 'warning';
	@Input('host') host!: Host;
	alarmCount: AlarmCount;
	filteredServices!: Service[];
	services!: Service[];
	hostImage: any;
	constructor(
		private _reportService: ReportsService,
		private dialog: MatDialog,
		public _snackBar: MatSnackBar
	) {
		this.alarmCount = {
			ok: 0,
			warning: 0,
			critical: 0,
			unknown: 0,
		};
	}

	ngOnInit(): void {
		this.updateCount();
	}

	updateCount() {
		this._reportService
			.getHostServices(this.host.idHost)
			.subscribe((serviceList: any) => {
				this.services = serviceList;
				this.filteredServices = serviceList;
				this.alarmCount.ok = this.services.filter(
					(alarm: Service) => alarm.CurrentAlarm?.Status == 'ok'
				).length;
				this.alarmCount.warning = this.services.filter(
					(alarm: Service) => alarm.CurrentAlarm?.Status == 'warning'
				).length;
				this.alarmCount.critical = this.services.filter(
					(alarm: Service) => alarm.CurrentAlarm?.Status == 'critical'
				).length;
				this.alarmCount.unknown = this.services.filter(
					(alarm: Service) => alarm.CurrentAlarm?.Status == 'unknown'
				).length;
			});
	}

	showHostImage() {
		return this.host.HostsImageUrl != null;
	}

	ngOnChanges(changes: SimpleChanges) {
		//this.updateCount();
		if (this.host.HostsImageUrl != undefined) {
			console.log('hello');
			const imageQuery: Query = {name: 'filePath', value: this.host.HostsImageUrl};
			this.hostImage = this._reportService.getHostImage(this.host.HostsImageUrl);
		}
	}

	filter(filter: string) {
		if (filter == 'total') this.filteredServices = this.services;
		else if (filter == 'critical')
			this.filteredServices = this.services.filter(
				service =>
					service.CurrentAlarm?.Status == filter ||
					service.CurrentAlarm?.Status == 'unknown'
			);
		else
			this.filteredServices = this.services.filter(
				service => service.CurrentAlarm?.Status == filter
			);
	}

	clearAlarm(status: string) {
		switch (status) {
			case 'warning':
				this.alarmCount.warning = this.alarmCount.warning - 1;
				this.alarmCount.ok = this.alarmCount.ok + 1;
				break;
			case 'critical':
				this.alarmCount.critical = this.alarmCount.critical - 1;
				this.alarmCount.ok = this.alarmCount.ok + 1;
				break;
			case 'unknown':
				this.alarmCount.critical = this.alarmCount.critical - 1;
				this.alarmCount.ok = this.alarmCount.ok + 1;
				break;
			default:
				break;
		}
	}

	openDialog() {
		const dialogRef = this.dialog.open(ChangePhotoComponent, {
			width: 'auto',
			height: 'auo',
			autoFocus: false,
			maxHeight: '90vh',
		});
		dialogRef.afterClosed().subscribe(photo => {
			this.updateHostPhoto(photo);
		});
	}

	updateHostPhoto(photo: any) {
		//convert photo file format
		//upload photo
		//wait for response
		const imageName = `${this.host.Hostname}.png`;
		const imageBlob = this.convertB64ToBlob(photo.data);
		const imageFile = new File([imageBlob], imageName, {type: 'image/png'});

		//create new form

		const formData = new FormData();
		formData.append('idHost', this.host.idHost.toString());
		formData.append('Hostname', this.host.Hostname);
		formData.append('hostImage', imageFile);
		this._reportService.updateHostImage(formData, this.host.idHost).subscribe(res => {
			this.hostImage = this._reportService.getHostImage(this.host.HostsImageUrl);
			this._snackBar.open(`Se guardo la imagen.`, '', {
				duration: 3500,
				verticalPosition: 'top',
				panelClass: ['background-snack-info'],
			});
			window.location.reload();
		});
		return imageFile;
	}

	private convertB64ToBlob(base64Image: string) {
		const parts = base64Image.split(';base64,');
		const imageType = parts[0].split(':')[1];
		const decodedData = window.atob(parts[1]);
		const array = new Uint8Array(decodedData.length);
		for (let i = 0; i < decodedData.length; i++) {
			array[i] = decodedData.charCodeAt(i);
		}
		return new Blob([array], {type: imageType});
	}
}
