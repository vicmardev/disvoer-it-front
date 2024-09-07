import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSupportOperatorComponent } from './delete-support-operator.component';

describe('DeleteSupportOperatorComponent', () => {
  let component: DeleteSupportOperatorComponent;
  let fixture: ComponentFixture<DeleteSupportOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSupportOperatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSupportOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
