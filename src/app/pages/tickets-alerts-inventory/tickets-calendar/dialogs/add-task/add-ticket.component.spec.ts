import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AddTicketComponent} from './add-task.component';

describe('AddTicketComponent', () => {
	let component: AddTicketComponent;
	let fixture: ComponentFixture<AddTicketComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AddTicketComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AddTicketComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
