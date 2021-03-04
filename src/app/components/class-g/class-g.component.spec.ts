import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassGComponent } from './class-g.component';

describe('ClassGComponent', () => {
  let component: ClassGComponent;
  let fixture: ComponentFixture<ClassGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
