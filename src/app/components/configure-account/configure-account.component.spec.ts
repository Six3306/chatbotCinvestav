import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureAccountComponent } from './configure-account.component';

describe('ConfigureAccountComponent', () => {
  let component: ConfigureAccountComponent;
  let fixture: ComponentFixture<ConfigureAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
