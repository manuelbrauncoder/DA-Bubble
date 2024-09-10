import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTaggableUsersComponent } from './popup-taggable-users.component';

describe('PopupTaggableUsersComponent', () => {
  let component: PopupTaggableUsersComponent;
  let fixture: ComponentFixture<PopupTaggableUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupTaggableUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTaggableUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
