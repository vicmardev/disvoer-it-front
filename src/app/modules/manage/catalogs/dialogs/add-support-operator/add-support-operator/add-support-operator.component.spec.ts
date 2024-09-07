import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupportOperatorComponent } from './add-support-operator.component';

describe('AddSupportOperatorComponent', () => {
  let component: AddSupportOperatorComponent;
  let fixture: ComponentFixture<AddSupportOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSupportOperatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupportOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
