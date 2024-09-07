import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterIncomingComponent } from './register-incoming.component';

describe('RegisterIncomingComponent', () => {
  let component: RegisterIncomingComponent;
  let fixture: ComponentFixture<RegisterIncomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterIncomingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
