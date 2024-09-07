import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ValidContractsComponent} from './validcontracts.component';

describe('ValidcontractsComponent', () => {
	let component: ValidContractsComponent;
	let fixture: ComponentFixture<ValidContractsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ValidContractsComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ValidContractsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
