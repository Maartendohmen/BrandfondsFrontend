import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterconformationComponent } from './registerconformation.component';

describe('RegisterconformationComponent', () => {
  let component: RegisterconformationComponent;
  let fixture: ComponentFixture<RegisterconformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterconformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterconformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
