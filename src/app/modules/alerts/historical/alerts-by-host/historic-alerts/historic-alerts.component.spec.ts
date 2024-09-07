import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricAlertsComponent } from './historic-alerts.component';

describe('HistoricAlertsComponent', () => {
  let component: HistoricAlertsComponent;
  let fixture: ComponentFixture<HistoricAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricAlertsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
