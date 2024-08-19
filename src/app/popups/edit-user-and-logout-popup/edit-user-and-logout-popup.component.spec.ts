import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserAndLogoutPopupComponent } from './edit-user-and-logout-popup.component';

describe('EditUserAndLogoutPopupComponent', () => {
  let component: EditUserAndLogoutPopupComponent;
  let fixture: ComponentFixture<EditUserAndLogoutPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserAndLogoutPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserAndLogoutPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
