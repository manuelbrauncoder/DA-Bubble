import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceMenuButtonComponent } from './workspace-menu-button.component';

describe('WorkspaceMenuButtonComponent', () => {
  let component: WorkspaceMenuButtonComponent;
  let fixture: ComponentFixture<WorkspaceMenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceMenuButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
