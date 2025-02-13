import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDelegateComponent } from './add-delegate.component';

describe('AddDelegateComponent', () => {
  let component: AddDelegateComponent;
  let fixture: ComponentFixture<AddDelegateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDelegateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDelegateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
