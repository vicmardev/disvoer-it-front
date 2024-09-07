import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupportOperatorComponent } from './edit-support-operator.component';

describe('EditSupportOperatorComponent', () => {
  let component: EditSupportOperatorComponent;
  let fixture: ComponentFixture<EditSupportOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSupportOperatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSupportOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
