import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDelegateByFileComponent } from './add-delegate-by-file.component';

describe('AddDelegateByFileComponent', () => {
  let component: AddDelegateByFileComponent;
  let fixture: ComponentFixture<AddDelegateByFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDelegateByFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDelegateByFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
