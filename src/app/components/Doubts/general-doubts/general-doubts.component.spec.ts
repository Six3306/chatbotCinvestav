import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDoubtsComponent } from './general-doubts.component';

describe('GeneralDoubtsComponent', () => {
  let component: GeneralDoubtsComponent;
  let fixture: ComponentFixture<GeneralDoubtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralDoubtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDoubtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
