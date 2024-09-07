import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePartsComponent } from './type-parts.component';

describe('TypePartsComponent', () => {
  let component: TypePartsComponent;
  let fixture: ComponentFixture<TypePartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypePartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypePartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
