import { TestBed } from '@angular/core/testing';

import { AboutusService } from './aboutus.service';

describe('AboutusService', () => {
  let service: AboutusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AboutusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
