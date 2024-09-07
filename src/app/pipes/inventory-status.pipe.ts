import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'inventoryStatus',
})
export class InventoryStatusPipe implements PipeTransform {
	private status: {[inventoryStatus: string]: string} = {
		Suspended: 'Suspendido',
		Active: 'Activo',
		'To Be Suspend': 'Por suspender',
	};

	transform(value: string, ...args: unknown[]): unknown {
		return value in this.status ? this.status[value] : '';
	}
}
