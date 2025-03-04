import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVisitorComponent } from './add-edit-visitor.component';

describe('AddEditVisitorComponent', () => {
  let component: AddEditVisitorComponent;
  let fixture: ComponentFixture<AddEditVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVisitorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
