import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTicketsComponent } from './home-tickets.component';

describe('HomeTicketsComponent', () => {
  let component: HomeTicketsComponent;
  let fixture: ComponentFixture<HomeTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
