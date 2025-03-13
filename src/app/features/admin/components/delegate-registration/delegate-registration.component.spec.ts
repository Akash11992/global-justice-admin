import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegateRegistrationComponent } from './delegate-registration.component';

describe('DelegateRegistrationComponent', () => {
  let component: DelegateRegistrationComponent;
  let fixture: ComponentFixture<DelegateRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegateRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegateRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
