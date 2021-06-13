import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeelingGroupComponent } from './feeling-group.component';

describe('FeelingGroupComponent', () => {
  let component: FeelingGroupComponent;
  let fixture: ComponentFixture<FeelingGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeelingGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeelingGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
