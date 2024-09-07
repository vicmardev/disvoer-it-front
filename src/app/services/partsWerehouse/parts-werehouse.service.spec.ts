import { TestBed } from '@angular/core/testing';

import { PartsWerehouseService } from './parts-werehouse.service';

describe('PartsWerehouseService', () => {
  let service: PartsWerehouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartsWerehouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
