import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinmailinglistComponent } from './joinmailinglist.component';

describe('JoinmailinglistComponent', () => {
  let component: JoinmailinglistComponent;
  let fixture: ComponentFixture<JoinmailinglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinmailinglistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinmailinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
