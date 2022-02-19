import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {

  username: string = "";
  password: string = "";
  redirectURL: string = "";


  constructor(private supabase: SupabaseService, private router: Router, private route: ActivatedRoute, private _snackBar: MatSnackBar) { 
    let params = this.route.snapshot.queryParams;
    if (params['redirectURL']) {
        this.redirectURL = params['redirectURL'];
    }
  }

  login() {
    this.supabase.signUp(this.username, this.password).then(
      (response) => {
        if (!response.error){
          // Redirect to the page that was requested before login
          this._snackBar.open("Login successful", "Dismiss", {duration: 2000});
          this.router.navigateByUrl(this.redirectURL).catch(() => { this.router.navigate(['/']); });
        } else{
          this._snackBar.open("Login failed", "Dismiss");
        }
      });
  }


}
