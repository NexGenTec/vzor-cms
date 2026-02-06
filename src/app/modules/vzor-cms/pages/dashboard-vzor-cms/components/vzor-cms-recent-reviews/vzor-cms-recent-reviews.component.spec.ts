import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VzorCmsRecentReviewsComponent } from './vzor-cms-recent-reviews.component';

describe('VzorCmsRecentReviewsComponent', () => {
  let component: VzorCmsRecentReviewsComponent;
  let fixture: ComponentFixture<VzorCmsRecentReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VzorCmsRecentReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VzorCmsRecentReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
