import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditpunishmentstripeComponent } from './admin-editpunishmentstripe.component';

describe('AdminEditpunishmentstripeComponent', () => {
  let component: AdminEditpunishmentstripeComponent;
  let fixture: ComponentFixture<AdminEditpunishmentstripeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditpunishmentstripeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditpunishmentstripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
