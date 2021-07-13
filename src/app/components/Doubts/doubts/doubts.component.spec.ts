import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubtsComponent } from './doubts.component';

describe('DoubtsComponent', () => {
  let component: DoubtsComponent;
  let fixture: ComponentFixture<DoubtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
