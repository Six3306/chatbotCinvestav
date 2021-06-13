import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeelingStudentsComponent } from './feeling-students.component';

describe('FeelingStudentsComponent', () => {
  let component: FeelingStudentsComponent;
  let fixture: ComponentFixture<FeelingStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeelingStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeelingStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
