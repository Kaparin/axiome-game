import { TestBed } from '@angular/core/testing';

import { OrexService } from './orex.service';

describe('OrexService', () => {
  let service: OrexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
