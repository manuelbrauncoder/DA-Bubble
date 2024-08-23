import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderForUsermanagementComponent } from './header-for-usermanagement.component';

describe('HeaderForUsermanagementComponent', () => {
  let component: HeaderForUsermanagementComponent;
  let fixture: ComponentFixture<HeaderForUsermanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderForUsermanagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderForUsermanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
