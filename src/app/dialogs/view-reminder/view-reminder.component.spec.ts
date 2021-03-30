import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReminderComponent } from './view-reminder.component';

describe('ViewReminderComponent', () => {
  let component: ViewReminderComponent;
  let fixture: ComponentFixture<ViewReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
