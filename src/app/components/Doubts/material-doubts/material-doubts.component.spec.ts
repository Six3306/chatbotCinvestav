import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDoubtsComponent } from './material-doubts.component';

describe('MaterialDoubtsComponent', () => {
  let component: MaterialDoubtsComponent;
  let fixture: ComponentFixture<MaterialDoubtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDoubtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDoubtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
