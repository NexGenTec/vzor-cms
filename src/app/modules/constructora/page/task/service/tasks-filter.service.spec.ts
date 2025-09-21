import { TestBed } from '@angular/core/testing';

import { TasksFilterService } from './tasks-filter.service';

describe('TasksFilterService', () => {
  let service: TasksFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
