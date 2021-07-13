import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | Promise<boolean> {
    const activate = this.authService.isAuthenticated();

    if (activate) {
      return activate;
    } else {
      this.router.navigateByUrl("/login");
      return false;
    }
  }
}
