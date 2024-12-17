import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountCoupanMasterComponent } from './discount-coupan-master.component';

describe('DiscountCoupanMasterComponent', () => {
  let component: DiscountCoupanMasterComponent;
  let fixture: ComponentFixture<DiscountCoupanMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountCoupanMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountCoupanMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
