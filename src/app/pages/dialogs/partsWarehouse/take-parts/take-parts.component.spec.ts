import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakePartsComponent } from './take-parts.component';

describe('TakePartsComponent', () => {
  let component: TakePartsComponent;
  let fixture: ComponentFixture<TakePartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakePartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TakePartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
