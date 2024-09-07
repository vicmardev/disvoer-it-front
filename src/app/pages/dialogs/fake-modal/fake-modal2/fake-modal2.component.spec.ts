import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeModal2Component } from './fake-modal2.component';

describe('FakeModal2Component', () => {
  let component: FakeModal2Component;
  let fixture: ComponentFixture<FakeModal2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FakeModal2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeModal2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
