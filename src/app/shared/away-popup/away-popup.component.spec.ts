import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwayPopupComponent } from './away-popup.component';

describe('AwayPopupComponent', () => {
  let component: AwayPopupComponent;
  let fixture: ComponentFixture<AwayPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwayPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwayPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
