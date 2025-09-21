import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketRowComponent } from './ticket-row.component';

describe('TicketRowComponent', () => {
  let component: TicketRowComponent;
  let fixture: ComponentFixture<TicketRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
