import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginDialogComponent } from '../dialog/login-dialog/login-dialog.component';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Check if local storage contains the session token
    if (this.supabase._supabase.auth.user() != null) {
      return true;
    }

    // If not call "openLoginDialog" from app.component.ts
    this.router.navigate(['/'], { queryParams: { redirectURL: state.url } });
    // Get app.component instantce
    this._snackBar.open('You need to be logged in to do that!', 'Dismiss');
    var username = '';
    var password = '';
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      data: { name: username, animal: password },
    });

    return false;
  }
}
