import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEditChannelComponent } from './popup-edit-channel.component';

describe('PopupEditChannelComponent', () => {
  let component: PopupEditChannelComponent;
  let fixture: ComponentFixture<PopupEditChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupEditChannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupEditChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
