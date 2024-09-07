import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeContractsComponent } from './make-contracts.component';

describe('MakeContractsComponent', () => {
  let component: MakeContractsComponent;
  let fixture: ComponentFixture<MakeContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
