import { TestBed } from '@angular/core/testing';

import { ProfessionistiService } from './professionisti.service';

describe('ProfessionistiService', () => {
  let service: ProfessionistiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfessionistiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
