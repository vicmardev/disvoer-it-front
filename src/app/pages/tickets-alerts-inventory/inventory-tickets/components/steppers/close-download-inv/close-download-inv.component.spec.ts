import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseDownloadInvComponent } from './close-download-inv.component';

describe('CloseDownloadInvComponent', () => {
  let component: CloseDownloadInvComponent;
  let fixture: ComponentFixture<CloseDownloadInvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseDownloadInvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseDownloadInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
