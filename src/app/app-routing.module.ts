import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { TestimonialsComponent } from './pages/testimonials/testimonials.component';
import { OurServicesComponent } from './pages/our-services/our-services.component';
import { SearchComponent } from './pages/search/search.component';
import { FAQComponent } from './pages/faq/faq.component';
import { ReceptionistComponent } from './pages/receptionist/receptionist.component';
import { RegisterComponent } from './pages/register/register.component';
import {SearchAppointmentComponent} from './pages/search-appointment/search-appointment.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'login', component: PageNotFoundComponent },
  { path: 'our-services', component: OurServicesComponent },
  { path: 'search', component: SearchComponent },
  { path: 'faq', component: FAQComponent },
  { path: 'receptionist', component: ReceptionistComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'search-appointment', component: SearchAppointmentComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
