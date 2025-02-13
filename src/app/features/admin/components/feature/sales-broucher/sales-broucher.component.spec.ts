import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBroucherComponent } from './sales-broucher.component';

describe('SalesBroucherComponent', () => {
  let component: SalesBroucherComponent;
  let fixture: ComponentFixture<SalesBroucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBroucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBroucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
