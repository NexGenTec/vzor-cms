import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructoraComponent } from './constructora.component';

describe('ConstructoraComponent', () => {
  let component: ConstructoraComponent;
  let fixture: ComponentFixture<ConstructoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
