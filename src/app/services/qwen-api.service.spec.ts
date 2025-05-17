import { TestBed } from '@angular/core/testing';

import { QwenApiService } from './qwen-api.service';

describe('QwenApiService', () => {
  let service: QwenApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QwenApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
