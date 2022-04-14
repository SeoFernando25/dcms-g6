import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AccountComponent } from './account/account.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { BillingComponent } from './billing/billing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReviewComponent } from './review/review.component';

const routes: Routes = [
  {
    path: 'my',
    canActivate: [AuthGuard],
    children: [
      { path: 'account', component: AccountComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'appointments/:id', component: AppointmentComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reviews', component: ReviewComponent },
      { path: 'billing', component: BillingComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
