import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeelingIndividualComponent } from './feeling-individual.component';

describe('FeelingIndividualComponent', () => {
  let component: FeelingIndividualComponent;
  let fixture: ComponentFixture<FeelingIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeelingIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeelingIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
