import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunCommandsComponent } from './run-commands.component';

describe('RunCommandsComponent', () => {
  let component: RunCommandsComponent;
  let fixture: ComponentFixture<RunCommandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunCommandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
