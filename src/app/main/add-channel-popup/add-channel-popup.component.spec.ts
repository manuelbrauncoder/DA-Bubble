import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChannelPopupComponent } from './add-channel-popup.component';

describe('AddChannelPopupComponent', () => {
  let component: AddChannelPopupComponent;
  let fixture: ComponentFixture<AddChannelPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChannelPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChannelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
