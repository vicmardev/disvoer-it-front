import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDatacenterComponent } from './edit-datacenter.component';

describe('EditDatacenterComponent', () => {
  let component: EditDatacenterComponent;
  let fixture: ComponentFixture<EditDatacenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDatacenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDatacenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
