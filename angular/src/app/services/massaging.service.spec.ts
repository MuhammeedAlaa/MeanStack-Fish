import { TestBed } from '@angular/core/testing';

import { MassagingService } from './massaging.service';

describe('MassagingService', () => {
  let service: MassagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MassagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
