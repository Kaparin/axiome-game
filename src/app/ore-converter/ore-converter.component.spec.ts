import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OreConverterComponent } from './ore-converter.component';

describe('OreConverterComponent', () => {
  let component: OreConverterComponent;
  let fixture: ComponentFixture<OreConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OreConverterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OreConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
