import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditsaldoComponent } from './admin-editsaldo.component';

describe('AdminEditsaldoComponent', () => {
  let component: AdminEditsaldoComponent;
  let fixture: ComponentFixture<AdminEditsaldoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditsaldoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditsaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
