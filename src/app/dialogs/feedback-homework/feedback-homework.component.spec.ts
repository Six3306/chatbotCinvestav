import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackHomeworkComponent } from './feedback-homework.component';

describe('FeedbackHomeworkComponent', () => {
  let component: FeedbackHomeworkComponent;
  let fixture: ComponentFixture<FeedbackHomeworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackHomeworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
