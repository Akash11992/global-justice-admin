import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewContactComponent } from './review-contact.component';

describe('ReviewContactComponent', () => {
  let component: ReviewContactComponent;
  let fixture: ComponentFixture<ReviewContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
