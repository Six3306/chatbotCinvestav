import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdviceWComponent } from './add-advice-w.component';

describe('AddAdviceWComponent', () => {
  let component: AddAdviceWComponent;
  let fixture: ComponentFixture<AddAdviceWComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdviceWComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdviceWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
