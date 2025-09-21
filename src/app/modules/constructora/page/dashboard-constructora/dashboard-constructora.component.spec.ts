import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardConstructoraComponent } from './dashboard-constructora.component';

describe('DashboardConstructoraComponent', () => {
  let component: DashboardConstructoraComponent;
  let fixture: ComponentFixture<DashboardConstructoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardConstructoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardConstructoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
