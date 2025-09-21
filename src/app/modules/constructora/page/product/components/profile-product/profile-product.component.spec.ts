import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProductComponent } from './profile-product.component';

describe('ProfileProductComponent', () => {
  let component: ProfileProductComponent;
  let fixture: ComponentFixture<ProfileProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
