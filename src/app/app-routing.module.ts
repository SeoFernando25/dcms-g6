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
import { SearchAppointmentComponent } from './pages/search-appointment/search-appointment.component';
import { RoleGuard } from './guards/role/role.guard';
import { DentistComponent } from './pages/dentist/dentist.component';
import { RecordComponent } from './pages/dentist/record/record.component';
import { TreatmentComponent } from './pages/dentist/treatment/treatment.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'login', component: PageNotFoundComponent },
  { path: 'our-services', component: OurServicesComponent },
  { path: 'search', component: SearchComponent },
  { path: 'faq', component: FAQComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'receptionist', component: ReceptionistComponent }, //, canActivate: [RoleGuard], data: { roles: ['Receptionist'] }
  { path: 'dentist', component: DentistComponent },
  { path: 'record', component: RecordComponent },
  { path: 'treatment', component: TreatmentComponent },
  { path: 'search-appointment', component: SearchAppointmentComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
