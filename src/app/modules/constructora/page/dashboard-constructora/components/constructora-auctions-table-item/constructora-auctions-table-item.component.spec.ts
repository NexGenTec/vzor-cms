import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructoraAuctionsTableItemComponent } from './constructora-auctions-table-item.component';

describe('ConstructoraAuctionsTableItemComponent', () => {
  let component: ConstructoraAuctionsTableItemComponent;
  let fixture: ComponentFixture<ConstructoraAuctionsTableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructoraAuctionsTableItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructoraAuctionsTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
