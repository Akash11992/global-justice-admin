import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeacekeeperUserComponent } from './peacekeeper-user.component';

describe('PeacekeeperUserComponent', () => {
  let component: PeacekeeperUserComponent;
  let fixture: ComponentFixture<PeacekeeperUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeacekeeperUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeacekeeperUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
