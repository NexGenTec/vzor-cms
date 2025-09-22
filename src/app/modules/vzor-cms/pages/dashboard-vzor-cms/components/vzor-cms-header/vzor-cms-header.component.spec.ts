import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VzorCmsHeaderComponent } from './vzor-cms-header.component';

describe('VzorCmsHeaderComponent', () => {
  let component: VzorCmsHeaderComponent;
  let fixture: ComponentFixture<VzorCmsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VzorCmsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VzorCmsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
