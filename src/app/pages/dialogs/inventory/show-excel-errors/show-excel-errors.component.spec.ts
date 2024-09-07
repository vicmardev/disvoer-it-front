import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowExcelErrorsComponent } from './show-excel-errors.component';

describe('ShowExcelErrorsComponent', () => {
  let component: ShowExcelErrorsComponent;
  let fixture: ComponentFixture<ShowExcelErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowExcelErrorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowExcelErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
