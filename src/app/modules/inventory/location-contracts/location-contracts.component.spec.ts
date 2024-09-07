import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationContractsComponent } from './location-contracts.component';

describe('LocationContractsComponent', () => {
  let component: LocationContractsComponent;
  let fixture: ComponentFixture<LocationContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
