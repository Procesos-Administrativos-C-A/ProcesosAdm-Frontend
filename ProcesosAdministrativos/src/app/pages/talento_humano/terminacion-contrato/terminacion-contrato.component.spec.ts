import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminacionContratoComponent } from './terminacion-contrato.component';

describe('TerminacionContratoComponent', () => {
  let component: TerminacionContratoComponent;
  let fixture: ComponentFixture<TerminacionContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminacionContratoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TerminacionContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
