import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketFooterComponent } from './ticket-footer.component';

describe('TicketFooterComponent', () => {
  let component: TicketFooterComponent;
  let fixture: ComponentFixture<TicketFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
