import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Local imports

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { CarouselComponent } from './ui/carousel/carousel.component';
import { MaterialModule } from './material.module';

const modules = [
  FormsModule,
  BrowserAnimationsModule,
  FlexLayoutModule,
  MaterialModule,
];

@NgModule({imports: [...modules], exports: [...modules], declarations: [
    HomeComponent,
    PageNotFoundComponent,
    CarouselComponent
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
