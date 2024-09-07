import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitModalComponent } from './wait-modal.component';

describe('WaitModalComponent', () => {
  let component: WaitModalComponent;
  let fixture: ComponentFixture<WaitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
