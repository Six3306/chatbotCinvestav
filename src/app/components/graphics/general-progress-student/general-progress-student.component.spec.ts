import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralProgressStudentComponent } from './general-progress-student.component';

describe('GeneralProgressStudentComponent', () => {
  let component: GeneralProgressStudentComponent;
  let fixture: ComponentFixture<GeneralProgressStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralProgressStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralProgressStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
