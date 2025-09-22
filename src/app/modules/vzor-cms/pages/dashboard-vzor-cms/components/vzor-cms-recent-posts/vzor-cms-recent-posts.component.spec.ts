import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VzorCmsRecentPostsComponent } from './vzor-cms-recent-posts.component';

describe('VzorCmsRecentPostsComponent', () => {
  let component: VzorCmsRecentPostsComponent;
  let fixture: ComponentFixture<VzorCmsRecentPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VzorCmsRecentPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VzorCmsRecentPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
