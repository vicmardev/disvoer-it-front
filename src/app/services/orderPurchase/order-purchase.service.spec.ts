import { TestBed } from '@angular/core/testing';

import { OrderPurchaseService } from './order-purchase.service';

describe('OrderPurchaseService', () => {
  let service: OrderPurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderPurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
