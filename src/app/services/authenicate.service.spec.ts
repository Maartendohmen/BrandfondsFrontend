import { TestBed } from '@angular/core/testing';

import { AuthenicateService } from './authenicate.service';

describe('AuthenicateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthenicateService = TestBed.get(AuthenicateService);
    expect(service).toBeTruthy();
  });
});
