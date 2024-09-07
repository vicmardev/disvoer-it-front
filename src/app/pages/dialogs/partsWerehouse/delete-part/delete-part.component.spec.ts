import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePartComponent } from './delete-part.component';

describe('DeletePartComponent', () => {
  let component: DeletePartComponent;
  let fixture: ComponentFixture<DeletePartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
