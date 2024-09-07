import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEquipmentsComponent } from './list-equipments.component';

describe('ListEquipmentsComponent', () => {
  let component: ListEquipmentsComponent;
  let fixture: ComponentFixture<ListEquipmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEquipmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEquipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
