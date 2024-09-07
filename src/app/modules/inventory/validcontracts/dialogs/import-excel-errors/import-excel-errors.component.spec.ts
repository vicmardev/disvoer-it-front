import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExcelErrorsComponent } from './import-excel-errors.component';

describe('ImportExcelErrorsComponent', () => {
  let component: ImportExcelErrorsComponent;
  let fixture: ComponentFixture<ImportExcelErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportExcelErrorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExcelErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
