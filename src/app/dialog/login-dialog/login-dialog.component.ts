import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseService } from 'src/app/services/supabase.service';

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
  username_exists = false;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoginDialogData,
    public readonly supabase: SupabaseService,
    private snackBar: MatSnackBar
  ) {
    var user = this.supabase._supabase.auth.user();
    if (user == null) {
      console.log("User not logged in");
    } else{
      console.log("User logged in");
    }
  }

  onLeaveUsernameField() {
    // Check if username exists in database
    console.log("Checking if username exists");
    


    this.supabase._supabase.rpc('email_exists', {e_mail: this.data.username}).then(
      (response) => {
        console.log(response);
        if (!response.error && response.data) {
          console.log("Username exists");
          this.username_exists = true;
        } else {
          console.log("Username does not exist");
          this.username_exists = false;
        }
      }
    );
  }


  tryLogin() {
    console.log("Trying to login");

    if (this.username_exists) { // Username exists, try to login
      this.supabase.signIn(this.data.username, this.data.password).then(
        (response) => {
          
          if (!response.error) {
            this.snackBar.open("Login successful", "Dismiss", {duration: 2000});
            this.dialogRef.close(true);
          } else {
            this.snackBar.open("Login failed", "Dismiss");
          }
        }
      );
    } else { // Username does not exist, try to sign up
      this.supabase.signUp(this.data.username, this.data.password).then(
        (postgrestRes) => {
          console.log(postgrestRes);
          if (!postgrestRes.error){
            this.snackBar.open("Login successful", "Dismiss", {duration: 2000});
            this.dialogRef.close(true);
          } else{
            this.snackBar.open("Login failed", "Dismiss");
          }
        }
      )
    }
  }
}