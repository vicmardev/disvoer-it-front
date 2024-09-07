import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliminaryInfoComponent } from './preliminary-info.component';

describe('PreliminaryInfoComponent', () => {
  let component: PreliminaryInfoComponent;
  let fixture: ComponentFixture<PreliminaryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreliminaryInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreliminaryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
