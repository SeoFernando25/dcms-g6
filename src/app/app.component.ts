import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthGuard } from './guards/auth.guard';

export interface LoginDialogData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'DCMS';
  public isReceptionist: boolean;
  public isDentist: boolean;

  constructor(
    public readonly supabase: SupabaseService,
    public dialog: MatDialog,
    public auth: AuthGuard
  ) {}

  checkRole() {
    var sb = this.supabase._supabase;

    sb.from('employee')
      .select('*')
      .eq('employee_id', sb.auth.user()?.id)
      .then((data) => {
        console.log('Role Data', data.body?.at(0));
        if (data.body?.at(0) != null) {
          let role = data.body?.at(0).role_type;
          if (role == 'Receptionist') {
            this.isReceptionist = true;
          } else {
            this.isDentist = true;
          }
        }
      });
  }
}
