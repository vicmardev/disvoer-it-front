import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTicketsComponent } from './inventory-tickets.component';

describe('InventoryTicketsComponent', () => {
  let component: InventoryTicketsComponent;
  let fixture: ComponentFixture<InventoryTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
