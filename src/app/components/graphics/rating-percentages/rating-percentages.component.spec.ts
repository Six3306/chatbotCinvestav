import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingPercentagesComponent } from './rating-percentages.component';

describe('RatingPercentagesComponent', () => {
  let component: RatingPercentagesComponent;
  let fixture: ComponentFixture<RatingPercentagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingPercentagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingPercentagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
