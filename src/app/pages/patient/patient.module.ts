import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsComponent } from './appointments/appointments.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientRoutingModule } from './patient-routing.module';
import { AppointmentRowComponent } from './patient/appointments/appointment-row/appointment-row.component';
import { AccountComponent } from './account/account.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaskModule } from 'ngx-mask';
import { AppointmentComponent } from './appointment/appointment.component';
import { ReviewComponent } from './review/review.component';
import { BillingComponent } from './billing/billing.component';
import { AddAppointmentComponent } from './appointments/add-appointment/add-appointment.component';
import { RecordsComponent } from './records/records.component';

@NgModule({
  declarations: [
    AddAppointmentComponent,
    AppointmentsComponent,
    DashboardComponent,
    AppointmentRowComponent,
    AccountComponent,
    AppointmentComponent,
    ReviewComponent,
    BillingComponent,
    RecordsComponent,
  ],
  imports: [
    NgxMaskModule.forRoot(),
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    PatientRoutingModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  providers: [MatDatepickerModule],
})
export class PatientModule {}
