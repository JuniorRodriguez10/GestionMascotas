import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async(route, state) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);
  
  const isAuthenticated = await authSrv.isAuthenticated().toPromise();
  console.log('Is user authenticated? ', isAuthenticated);

  if (!isAuthenticated) {
    router.navigateByUrl("/inicio");
    return false;
  }

  return true;
};