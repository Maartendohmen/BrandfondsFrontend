import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationActivationComponent } from './registration-activation.component';

describe('RegistrationActivationComponent', () => {
  let component: RegistrationActivationComponent;
  let fixture: ComponentFixture<RegistrationActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
