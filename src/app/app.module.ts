import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';  
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';


import { FlexLayoutModule } from '@angular/flex-layout';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';

const modules = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatIconModule,
  FormsModule,
  BrowserAnimationsModule,
  MatToolbarModule,
  MatSidenavModule,
  MatMenuModule,
  MatExpansionModule,
  FlexLayoutModule,

];

@NgModule({imports: [...modules], exports: [...modules], declarations: [
    HomeComponent,
    PageNotFoundComponent
  ]})
export class ExternalModules {};



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ExternalModules,
  ],
 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
