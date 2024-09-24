import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDetailViewComponent } from './data-detail-view.component';

describe('DataDetailViewComponent', () => {
  let component: DataDetailViewComponent;
  let fixture: ComponentFixture<DataDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataDetailViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
