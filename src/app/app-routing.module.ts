import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { TestimonialsComponent } from './pages/testimonials/testimonials.component';
import { OurServicesComponent } from './pages/our-services/our-services.component';
import { SearchComponent } from './pages/search/search.component';
import { FAQComponent } from './pages/faq/faq.component';
import { MyAccountComponent } from './pages/account/account.component';
import {ReviewComponent} from './pages/patient/review/review.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'login', component: PageNotFoundComponent },
  { path: 'our-services', component: OurServicesComponent },
<<<<<<< HEAD
  { path: 'search', component: SearchComponent },
=======
  { path: 'account', component: MyAccountComponent },
  { path: 'review', component: ReviewComponent },
>>>>>>> 0efe89a62336860ab4340ffd9e823013bfb1afe9
  { path: 'faq', component: FAQComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
