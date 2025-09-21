import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarAddComponent } from './calendar-add.component';

describe('CalendarAddComponent', () => {
  let component: CalendarAddComponent;
  let fixture: ComponentFixture<CalendarAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
