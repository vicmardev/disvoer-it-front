import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliminaryInfoInvComponent } from './preliminary-info-inv.component';

describe('PreliminaryInfoInvComponent', () => {
  let component: PreliminaryInfoInvComponent;
  let fixture: ComponentFixture<PreliminaryInfoInvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreliminaryInfoInvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreliminaryInfoInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
