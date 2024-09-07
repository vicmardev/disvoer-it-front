import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsByHostComponent } from './alerts-by-host.component';

describe('AlertsByHostComponent', () => {
  let component: AlertsByHostComponent;
  let fixture: ComponentFixture<AlertsByHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsByHostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsByHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
