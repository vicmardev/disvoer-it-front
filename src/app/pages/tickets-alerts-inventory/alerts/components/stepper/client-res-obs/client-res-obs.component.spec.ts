import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientResObsComponent } from './client-res-obs.component';

describe('ClientResObsComponent', () => {
  let component: ClientResObsComponent;
  let fixture: ComponentFixture<ClientResObsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientResObsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientResObsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
