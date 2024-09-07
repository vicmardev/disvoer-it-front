import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsDetailsComponent } from './parts-details.component';

describe('PartsDetailsComponent', () => {
  let component: PartsDetailsComponent;
  let fixture: ComponentFixture<PartsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
