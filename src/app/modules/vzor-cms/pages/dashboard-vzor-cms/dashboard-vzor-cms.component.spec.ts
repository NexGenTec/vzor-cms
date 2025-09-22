import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVzorCmsComponent } from './dashboard-vzor-cms.component';

describe('DashboardVzorCmsComponent', () => {
  let component: DashboardVzorCmsComponent;
  let fixture: ComponentFixture<DashboardVzorCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardVzorCmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardVzorCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
