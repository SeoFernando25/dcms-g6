import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './dialog/login-dialog/login-dialog.component';
import { ActivatedRoute } from '@angular/router';

export interface LoginDialogData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'DCMS';
  username: string = "";
  password: string = "";
  
  constructor(public readonly supabase: SupabaseService, public dialog: MatDialog, private route: ActivatedRoute) {
  }

  ngOnInit() {
    
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      data: {name: this.username, animal: this.password},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.username = result;
      this.password = "";
    });
  }

}
