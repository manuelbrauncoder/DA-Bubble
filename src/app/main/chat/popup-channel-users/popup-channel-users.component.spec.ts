import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupChannelUsersComponent } from './popup-channel-users.component';

describe('PopupChannelUsersComponent', () => {
  let component: PopupChannelUsersComponent;
  let fixture: ComponentFixture<PopupChannelUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupChannelUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupChannelUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
