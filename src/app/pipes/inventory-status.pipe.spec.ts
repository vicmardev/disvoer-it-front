import {InventoryStatusPipe} from './inventory-status.pipe';

describe('inventoryStatusPipe', () => {
	it('create an instance', () => {
		const pipe = new InventoryStatusPipe();
		expect(pipe).toBeTruthy();
	});
});
