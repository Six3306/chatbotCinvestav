import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassFailComponent } from './pass-fail.component';

describe('PassFailComponent', () => {
  let component: PassFailComponent;
  let fixture: ComponentFixture<PassFailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassFailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
