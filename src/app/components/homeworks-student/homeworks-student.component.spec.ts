import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworksStudentComponent } from './homeworks-student.component';

describe('HomeworksStudentComponent', () => {
  let component: HomeworksStudentComponent;
  let fixture: ComponentFixture<HomeworksStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeworksStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworksStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
