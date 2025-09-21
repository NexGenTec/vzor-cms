import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTicketComponent } from './profile-ticket.component';

describe('ProfileTicketComponent', () => {
  let component: ProfileTicketComponent;
  let fixture: ComponentFixture<ProfileTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
