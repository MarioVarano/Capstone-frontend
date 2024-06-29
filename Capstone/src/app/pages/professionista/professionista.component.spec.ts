import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionistaComponent } from './professionista.component';

describe('ProfessionistaComponent', () => {
  let component: ProfessionistaComponent;
  let fixture: ComponentFixture<ProfessionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfessionistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfessionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
