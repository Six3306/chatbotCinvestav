import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkDoubtsComponent } from './homework-doubts.component';

describe('HomeworkDoubtsComponent', () => {
  let component: HomeworkDoubtsComponent;
  let fixture: ComponentFixture<HomeworkDoubtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeworkDoubtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworkDoubtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
