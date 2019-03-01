    /**
 * Created By : Vijeta Rathod
 */

import { TestBed, inject } from '@angular/core/testing';

import { ProductService } from './product.service';

describe('ProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService]
    });
  });

  it('should be created', inject([ProductService], (service: ProductService) => {
    expect(service).toBeTruthy();
  }));
});

    /**
 * Created By : Vijeta Rathod
 */
