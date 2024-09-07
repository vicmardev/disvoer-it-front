import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTicketAlertComponent } from './create-ticket-alert.component';

describe('CreateTicketAlertComponent', () => {
  let component: CreateTicketAlertComponent;
  let fixture: ComponentFixture<CreateTicketAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTicketAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTicketAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
