import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authInicioSesionGuard } from './auth-inicio-sesion.guard';

describe('authInicioSesionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authInicioSesionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
