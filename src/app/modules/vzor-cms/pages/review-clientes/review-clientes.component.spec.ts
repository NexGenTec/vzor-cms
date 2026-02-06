import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewClientesComponent } from './review-clientes.component';

describe('ReviewClientesComponent', () => {
  let component: ReviewClientesComponent;
  let fixture: ComponentFixture<ReviewClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
