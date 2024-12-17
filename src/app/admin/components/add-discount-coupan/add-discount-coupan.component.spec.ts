import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiscountCoupanComponent } from './add-discount-coupan.component';

describe('AddDiscountCoupanComponent', () => {
  let component: AddDiscountCoupanComponent;
  let fixture: ComponentFixture<AddDiscountCoupanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDiscountCoupanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDiscountCoupanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
