import {Inject, Injectable} from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(@Inject('auth') private auth, public route: Router) { }

  canActivate(): boolean {
    if (this.auth.Authenticated()) {
      return true;
    } else {
      // redirect to home page if not looged in
      this.route.navigate(['/problems']);
      return false;
    }
  }

  isAdmin(): boolean {
    if (this.auth.Authenticated() && this.auth.getProfile().roles.includes('admin')) {
      return true;
    } else {
      return false;
    }
  }
}
