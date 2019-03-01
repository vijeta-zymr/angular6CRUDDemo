    /**
 * Created By : Vijeta Rathod
 */

import { TestBed, inject } from '@angular/core/testing';

import { UserdataService } from './user.service';

describe('ProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserdataService]
    });
  });

  it('should be created', inject([UserdataService], (service: UserdataService) => {
    expect(service).toBeTruthy();
  }));
});

    /**
 * Created By : Vijeta Rathod
 */
