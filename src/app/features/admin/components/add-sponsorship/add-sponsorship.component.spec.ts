import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSponsorshipComponent } from './add-sponsorship.component';

describe('AddSponsorshipComponent', () => {
  let component: AddSponsorshipComponent;
  let fixture: ComponentFixture<AddSponsorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSponsorshipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
