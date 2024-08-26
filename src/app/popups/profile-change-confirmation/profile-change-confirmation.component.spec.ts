import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileChangeConfirmationComponent } from './profile-change-confirmation.component';

describe('ProfileChangeConfirmationComponent', () => {
  let component: ProfileChangeConfirmationComponent;
  let fixture: ComponentFixture<ProfileChangeConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileChangeConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileChangeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
