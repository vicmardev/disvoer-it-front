import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPdfsComponent } from './download-pdfs.component';

describe('DownloadPdfsComponent', () => {
  let component: DownloadPdfsComponent;
  let fixture: ComponentFixture<DownloadPdfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadPdfsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPdfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
