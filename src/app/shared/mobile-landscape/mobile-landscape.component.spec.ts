import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileLandscapeComponent } from './mobile-landscape.component';

describe('MobileLandscapeComponent', () => {
  let component: MobileLandscapeComponent;
  let fixture: ComponentFixture<MobileLandscapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileLandscapeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileLandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
