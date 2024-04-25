import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteConsolidadoComponent } from './reporte-consolidado.component';

describe('ReporteConsolidadoComponent', () => {
  let component: ReporteConsolidadoComponent;
  let fixture: ComponentFixture<ReporteConsolidadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteConsolidadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteConsolidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
