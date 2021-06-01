import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsHomeworksComponent } from './view-details-homeworks.component';

describe('ViewDetailsHomeworksComponent', () => {
  let component: ViewDetailsHomeworksComponent;
  let fixture: ComponentFixture<ViewDetailsHomeworksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDetailsHomeworksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailsHomeworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
