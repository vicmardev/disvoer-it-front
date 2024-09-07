import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTopologiesComponent } from './list-topologies.component';

describe('ListTopologiesComponent', () => {
  let component: ListTopologiesComponent;
  let fixture: ComponentFixture<ListTopologiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTopologiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTopologiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
