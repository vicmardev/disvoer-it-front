import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRowInventoryComponent } from './delete-row-inventory.component';

describe('DeleteRowInventoryComponent', () => {
  let component: DeleteRowInventoryComponent;
  let fixture: ComponentFixture<DeleteRowInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRowInventoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRowInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
