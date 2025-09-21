import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructoraHeaderComponent } from './constructora-header.component';

describe('ConstructoraHeaderComponent', () => {
  let component: ConstructoraHeaderComponent;
  let fixture: ComponentFixture<ConstructoraHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructoraHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructoraHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
