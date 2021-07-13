import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamDoubtsComponent } from './exam-doubts.component';

describe('ExamDoubtsComponent', () => {
  let component: ExamDoubtsComponent;
  let fixture: ComponentFixture<ExamDoubtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamDoubtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamDoubtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
