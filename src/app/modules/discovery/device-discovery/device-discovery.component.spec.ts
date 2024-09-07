import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDiscoveryComponent } from './device-discovery.component';

describe('DeviceDiscoveryComponent', () => {
  let component: DeviceDiscoveryComponent;
  let fixture: ComponentFixture<DeviceDiscoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceDiscoveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
