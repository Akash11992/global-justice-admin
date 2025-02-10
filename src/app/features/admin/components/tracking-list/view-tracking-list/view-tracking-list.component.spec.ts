import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrackingListComponent } from './view-tracking-list.component';

describe('ViewTrackingListComponent', () => {
  let component: ViewTrackingListComponent;
  let fixture: ComponentFixture<ViewTrackingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTrackingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTrackingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
