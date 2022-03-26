import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  constructor(
    private snackBar: MatSnackBar,
    private supabase: SupabaseService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  onRequestAppointment() {
    // TODO: Create appointments page with AuthGuard
    this.router.navigate(['/appointments']);
  }
}
