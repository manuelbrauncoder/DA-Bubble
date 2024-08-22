import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChannelPopup2Component } from './add-channel-popup-2.component';

describe('AddChannelPopup2Component', () => {
  let component: AddChannelPopup2Component;
  let fixture: ComponentFixture<AddChannelPopup2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChannelPopup2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChannelPopup2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
