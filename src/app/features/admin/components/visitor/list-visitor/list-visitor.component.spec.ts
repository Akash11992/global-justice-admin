import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVisitorComponent } from './list-visitor.component';

describe('ListVisitorComponent', () => {
  let component: ListVisitorComponent;
  let fixture: ComponentFixture<ListVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListVisitorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
