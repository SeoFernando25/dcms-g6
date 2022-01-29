import { Component } from '@angular/core';

export interface LoginDialogData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DCMS';
  isLogged = false;
  
  constructor() {
    console.log('AppComponent.constructor()');
  }

}
