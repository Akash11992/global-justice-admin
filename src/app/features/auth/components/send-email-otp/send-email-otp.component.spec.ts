import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailOtpComponent } from './send-email-otp.component';

describe('SendEmailOtpComponent', () => {
  let component: SendEmailOtpComponent;
  let fixture: ComponentFixture<SendEmailOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendEmailOtpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendEmailOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
