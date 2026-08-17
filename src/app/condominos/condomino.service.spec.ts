import { TestBed } from '@angular/core/testing';

import { CondominoService } from './condomino.service';

describe('CondominoService', () => {
  let service: CondominoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CondominoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
