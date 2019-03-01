import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnrxjsComponent } from './learnrxjs.component';

describe('LearnrxjsComponent', () => {
  let component: LearnrxjsComponent;
  let fixture: ComponentFixture<LearnrxjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnrxjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnrxjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
