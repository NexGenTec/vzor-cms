import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTaskComponent } from './profile-task.component';

describe('ProfileTaskComponent', () => {
  let component: ProfileTaskComponent;
  let fixture: ComponentFixture<ProfileTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
