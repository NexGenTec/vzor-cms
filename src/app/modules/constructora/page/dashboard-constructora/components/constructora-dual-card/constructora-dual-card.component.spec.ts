import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructoraDualCardComponent } from './constructora-dual-card.component';

describe('ConstructoraDualCardComponent', () => {
  let component: ConstructoraDualCardComponent;
  let fixture: ComponentFixture<ConstructoraDualCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructoraDualCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructoraDualCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
