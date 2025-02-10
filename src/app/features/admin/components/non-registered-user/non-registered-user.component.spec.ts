import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonRegisteredUserComponent } from './non-registered-user.component';

describe('NonRegisteredUserComponent', () => {
  let component: NonRegisteredUserComponent;
  let fixture: ComponentFixture<NonRegisteredUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonRegisteredUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonRegisteredUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
