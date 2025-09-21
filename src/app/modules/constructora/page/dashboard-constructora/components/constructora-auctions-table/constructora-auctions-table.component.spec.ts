import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructoraAuctionsTableComponent } from './constructora-auctions-table.component';

describe('ConstructoraAuctionsTableComponent', () => {
  let component: ConstructoraAuctionsTableComponent;
  let fixture: ComponentFixture<ConstructoraAuctionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructoraAuctionsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructoraAuctionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
