import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadContactComponent } from './upload-contact.component';

describe('UploadContactComponent', () => {
  let component: UploadContactComponent;
  let fixture: ComponentFixture<UploadContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
