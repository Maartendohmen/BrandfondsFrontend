import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDepositrequestComponent } from './admin-depositrequest.component';

describe('AdminDepositrequestComponent', () => {
  let component: AdminDepositrequestComponent;
  let fixture: ComponentFixture<AdminDepositrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDepositrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDepositrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
