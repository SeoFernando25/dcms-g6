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

  constructor(
    public readonly supabase: SupabaseService,
    public dialog: MatDialog,
    public auth: AuthGuard
  ) {
  }
}
