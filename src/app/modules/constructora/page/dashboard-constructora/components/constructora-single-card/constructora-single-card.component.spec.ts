import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructoraSingleCardComponent } from './constructora-single-card.component';

describe('ConstructoraSingleCardComponent', () => {
  let component: ConstructoraSingleCardComponent;
  let fixture: ComponentFixture<ConstructoraSingleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructoraSingleCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructoraSingleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
