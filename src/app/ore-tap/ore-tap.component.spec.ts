import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OreTapComponent } from './ore-tap.component';

describe('OreTapComponent', () => {
  let component: OreTapComponent;
  let fixture: ComponentFixture<OreTapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OreTapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OreTapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
