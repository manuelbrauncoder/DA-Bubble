import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupViewOtherUsersProfileComponent } from './popup-view-other-users-profile.component';

describe('PopupViewOtherUsersProfileComponent', () => {
  let component: PopupViewOtherUsersProfileComponent;
  let fixture: ComponentFixture<PopupViewOtherUsersProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupViewOtherUsersProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupViewOtherUsersProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
