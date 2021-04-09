import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressStudentComponent } from './progress-student.component';

describe('ProgressStudentComponent', () => {
  let component: ProgressStudentComponent;
  let fixture: ComponentFixture<ProgressStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
