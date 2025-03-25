import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const userRole = localStorage.getItem('userRole');

  const requiredRole = route.data['role']

  if (userRole === requiredRole) {
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};
