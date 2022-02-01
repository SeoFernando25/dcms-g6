import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseService } from 'src/app/supabase.service';

export interface LoginDialogData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent{
  hide_password = true;
  username_ok = false;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoginDialogData,
    public readonly supabase: SupabaseService,
    private snackBar: MatSnackBar
  ) {}


  tryLogin() {
    console.log("Trying to login");
    this.supabase.signIn(this.data.username, this.data.password).then(
      (loginOk) => {
        if (loginOk){
          this.dialogRef.close(true);
        } else{
          this.snackBar.open("Login failed", "Dismiss");
        }
      }
    )
  }
}