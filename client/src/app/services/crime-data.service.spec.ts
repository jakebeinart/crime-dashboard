import { TestBed } from '@angular/core/testing';

import { CrimeDataService } from './crime-data.service';

describe('CrimeDataService', () => {
  let service: CrimeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrimeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
