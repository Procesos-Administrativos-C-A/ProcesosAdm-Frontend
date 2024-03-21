import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreoperativosComponent } from './preoperativos.component';

describe('PreoperativosComponent', () => {
  let component: PreoperativosComponent;
  let fixture: ComponentFixture<PreoperativosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreoperativosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreoperativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
