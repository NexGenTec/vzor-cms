import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VzorCmsRecentRecursosComponent } from './vzor-cms-recent-recursos.component';

describe('VzorCmsRecentRecursosComponent', () => {
  let component: VzorCmsRecentRecursosComponent;
  let fixture: ComponentFixture<VzorCmsRecentRecursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VzorCmsRecentRecursosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VzorCmsRecentRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
