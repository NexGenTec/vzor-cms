import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarActionComponent } from './calendar-action.component';

describe('CalendarActionComponent', () => {
  let component: CalendarActionComponent;
  let fixture: ComponentFixture<CalendarActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
