import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignTicketComponent } from './reassign-ticket.component';

describe('ReassignTicketComponent', () => {
  let component: ReassignTicketComponent;
  let fixture: ComponentFixture<ReassignTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReassignTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
