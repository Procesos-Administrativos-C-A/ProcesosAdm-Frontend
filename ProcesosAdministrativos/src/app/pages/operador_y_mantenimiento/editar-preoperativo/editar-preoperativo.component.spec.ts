import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPreoperativoComponent } from './EditarPreoperativoComponent';

describe('EditarPreoperativoComponent', () => {
  let component: EditarPreoperativoComponent;
  let fixture: ComponentFixture<EditarPreoperativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPreoperativoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarPreoperativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
