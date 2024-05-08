import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCLComponent } from './solicitud-cl.component';

describe('SolicitudCLComponent', () => {
  let component: SolicitudCLComponent;
  let fixture: ComponentFixture<SolicitudCLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudCLComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudCLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
