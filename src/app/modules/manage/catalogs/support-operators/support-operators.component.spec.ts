import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportOperatorsComponent } from './support-operators.component';

describe('SupportOperatorsComponent', () => {
  let component: SupportOperatorsComponent;
  let fixture: ComponentFixture<SupportOperatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportOperatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
