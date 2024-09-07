import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SLAsComponent } from './slas.component';

describe('SLAsComponent', () => {
  let component: SLAsComponent;
  let fixture: ComponentFixture<SLAsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SLAsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SLAsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
