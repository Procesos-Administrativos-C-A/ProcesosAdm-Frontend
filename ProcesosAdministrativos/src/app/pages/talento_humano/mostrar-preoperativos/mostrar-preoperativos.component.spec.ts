import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarPreoperativosComponent } from './mostrar-preoperativos.component';

describe('MostrarPreoperativosComponent', () => {
  let component: MostrarPreoperativosComponent;
  let fixture: ComponentFixture<MostrarPreoperativosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarPreoperativosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostrarPreoperativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
