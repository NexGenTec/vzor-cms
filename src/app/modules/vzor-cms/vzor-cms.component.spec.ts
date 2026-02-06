import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VzorCmsComponent } from './vzor-cms.component';

describe('VzorCmsComponent', () => {
  let component: VzorCmsComponent;
  let fixture: ComponentFixture<VzorCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VzorCmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VzorCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
