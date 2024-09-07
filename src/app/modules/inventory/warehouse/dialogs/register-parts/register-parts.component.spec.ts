import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPartsComponent } from './register-parts.component';

describe('RegisterPartsComponent', () => {
  let component: RegisterPartsComponent;
  let fixture: ComponentFixture<RegisterPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterPartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
