import {NONE_TYPE} from '@angular/compiler';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
	selector: 'app-qr-reader',
	templateUrl: './qr-reader.component.html',
	styleUrls: ['./qr-reader.component.scss'],
})
export class QrReaderComponent implements OnInit {
	//TODO: create part interface
	@Output() qrInfo = new EventEmitter<string | any>();
	hasPermission!: boolean;
	hasDevices!: boolean;

	availableDevices!: MediaDeviceInfo[];
	currentDevice: MediaDeviceInfo | undefined = undefined;

	torchEnabled = false;
	torchAvailable$ = new BehaviorSubject<boolean>(false);

	constructor() {}

	ngOnInit(): void {}

	onCodeResult(event: any) {
		let part: any = NONE_TYPE;
		try {
			part = JSON.parse(event);
			this.qrInfo.emit(part);
		} catch (e) {
			//string from qr code
			const partString = event.split(' ');
			part =
				partString.length == 4
					? {
							Brand: partString[0],
							Model: partString[1],
							SerialNumber: partString[3],
					  }
					: {
							Brand: 'Sin Marca',
							Model: partString[0],
							SerialNumber: partString[2],
					  };
			this.qrInfo.emit(part);
		}
	}

	onHasPermission(has: boolean) {
		console.log(has);

		this.hasPermission = has;
	}

	onCamerasFound(devices: MediaDeviceInfo[]): void {
		this.availableDevices = devices;
		this.hasDevices = Boolean(devices && devices.length);
	}

	onDeviceSelectChange(selected: any) {
		selected = selected.target.value;
		const device = this.availableDevices.find(x => x.deviceId === selected);
		this.currentDevice = device || undefined;
	}

	onTorchCompatible(isCompatible: boolean): void {
		this.torchAvailable$.next(isCompatible || false);
	}

	toggleTorch(): void {
		this.torchEnabled = !this.torchEnabled;
	}
}
