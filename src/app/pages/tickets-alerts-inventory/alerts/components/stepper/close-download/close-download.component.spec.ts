import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseDownloadComponent } from './close-download.component';

describe('CloseDownloadComponent', () => {
  let component: CloseDownloadComponent;
  let fixture: ComponentFixture<CloseDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
