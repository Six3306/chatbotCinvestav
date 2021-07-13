import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDoubtComponent } from './details-doubt.component';

describe('DetailsDoubtComponent', () => {
  let component: DetailsDoubtComponent;
  let fixture: ComponentFixture<DetailsDoubtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsDoubtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsDoubtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
