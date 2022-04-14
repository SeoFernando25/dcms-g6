import { Injectable } from '@angular/core';
import { ActivatedRoute,ActivatedRouteSnapshot, Router, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseService } from '../../services/supabase.service';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  
  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }
  

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    let role = route.data?.['roles']??[];
    console.log('Role Guard: ', role);
    let sb = this.supabase._supabase;
    return sb.from('person')
    .select('*, employee("*"), patient!patient_patient_id_fkey("*")')
    .eq('auth_id', sb.auth.user()?.id)
    .limit(1)
    .single()
    .then((data) => {
      if (data.error) {
        console.log('Patient Role ID False: ', sb.auth.user()?.id);
        console.log('data.error: ', data.error);
        return false;
      }else{
        console.log('Patient Role ID True: ', sb.auth.user()?.id);
        //console.log('data: ', data.body.patient.length);
        console.log('data: ', data.body.employee.at(0).role_type);
        console.log('roleguard', role.length);
        for (let i = 0; i < role.length; i++) {
          if (role[i] == "Patient") {
            if (data.body.patient.length > 0) {
              return true;
            }
          }

          if (data.body.employee.at(0).role_type == role[i]) {
            return true;
          }
        }
        return false;
      }
  });

}
}
