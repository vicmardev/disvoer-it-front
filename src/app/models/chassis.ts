import {MatTableDataSource} from '@angular/material/table';
import {ComponentChassis} from './Component-chassis';

export interface Chassis {
	IdChasisEquipment: string;
	Hostname: string;
	Ip: string;
	Brand: string;
	Model: string;
	SerialNumber: string;
	FirmwareVersion: string;
	Type: string;
	createdAt: Date;
	updatedAt: Date;
	components?: ComponentChassis[] | MatTableDataSource<ComponentChassis>;
}
