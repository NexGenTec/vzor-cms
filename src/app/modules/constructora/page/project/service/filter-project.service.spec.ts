import { TestBed } from '@angular/core/testing';

import { FilterProjectService } from './filter-project.service';

describe('FilterProjectService', () => {
  let service: FilterProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
