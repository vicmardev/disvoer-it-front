import { TestBed } from '@angular/core/testing';

import { ReporProblemService } from './repor-problem.service';

describe('ReporProblemService', () => {
  let service: ReporProblemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporProblemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
