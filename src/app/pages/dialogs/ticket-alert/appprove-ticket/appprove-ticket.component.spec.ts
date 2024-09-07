import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppproveTicketComponent } from './appprove-ticket.component';

describe('AppproveTicketComponent', () => {
  let component: AppproveTicketComponent;
  let fixture: ComponentFixture<AppproveTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppproveTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppproveTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
