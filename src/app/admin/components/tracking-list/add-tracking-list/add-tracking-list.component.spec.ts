import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrackingListComponent } from './add-tracking-list.component';

describe('AddTrackingListComponent', () => {
  let component: AddTrackingListComponent;
  let fixture: ComponentFixture<AddTrackingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrackingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrackingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
