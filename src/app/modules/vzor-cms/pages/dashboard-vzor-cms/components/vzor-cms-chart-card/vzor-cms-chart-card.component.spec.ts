import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VzorCmsChartCardComponent } from './vzor-cms-chart-card.component';

describe('VzorCmsChartCardComponent', () => {
  let component: VzorCmsChartCardComponent;
  let fixture: ComponentFixture<VzorCmsChartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VzorCmsChartCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VzorCmsChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
