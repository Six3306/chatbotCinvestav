import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualProgressComponent } from './individual-progress.component';

describe('IndividualProgressComponent', () => {
  let component: IndividualProgressComponent;
  let fixture: ComponentFixture<IndividualProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
