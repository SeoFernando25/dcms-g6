import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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


  constructor(private supabase: SupabaseService, private router: Router, private route: ActivatedRoute) { 
    let params = this.route.snapshot.queryParams;
    if (params['redirectURL']) {
        this.redirectURL = params['redirectURL'];
    }
  }

  login() {
    this.supabase.signIn(this.username, this.password).then(
      (loginOk) => {
        if (loginOk){
          // Redirect to the page that was requested before login
          console.log("Login ok");
          this.router.navigateByUrl(this.redirectURL).catch(() => { this.router.navigate(['/']); });
        } else{
          console.log("Login failed");
        }
      });
  }


}
