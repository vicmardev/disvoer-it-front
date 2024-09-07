import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacePartComponent } from './replace-part.component';

describe('ReplacePartComponent', () => {
  let component: ReplacePartComponent;
  let fixture: ComponentFixture<ReplacePartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplacePartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
