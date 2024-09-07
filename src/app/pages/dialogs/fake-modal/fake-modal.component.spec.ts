import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeModalComponent } from './fake-modal.component';

describe('FakeModalComponent', () => {
  let component: FakeModalComponent;
  let fixture: ComponentFixture<FakeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FakeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
