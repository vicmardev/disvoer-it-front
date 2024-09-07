import { TestBed } from '@angular/core/testing';

import { SupportOperatorsService } from './support-operators.service';

describe('SupportOperatorsService', () => {
  let service: SupportOperatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportOperatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
