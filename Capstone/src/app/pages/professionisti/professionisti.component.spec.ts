import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionistiComponent } from './professionisti.component';

describe('ProfessionistiComponent', () => {
  let component: ProfessionistiComponent;
  let fixture: ComponentFixture<ProfessionistiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfessionistiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfessionistiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
