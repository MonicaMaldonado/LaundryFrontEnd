import { TestBed } from '@angular/core/testing';

import { ServicesServiceTsService } from './services.service.ts.service';

describe('ServicesServiceTsService', () => {
  let service: ServicesServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
