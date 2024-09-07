import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsCalendarComponent } from './tickets-calendar.component';

describe('TicketsCalendarComponent', () => {
  let component: TicketsCalendarComponent;
  let fixture: ComponentFixture<TicketsCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
