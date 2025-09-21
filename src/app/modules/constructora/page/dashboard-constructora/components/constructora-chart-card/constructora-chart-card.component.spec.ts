import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructoraChartCardComponent } from './constructora-chart-card.component';

describe('ConstructoraChartCardComponent', () => {
  let component: ConstructoraChartCardComponent;
  let fixture: ComponentFixture<ConstructoraChartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructoraChartCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructoraChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
