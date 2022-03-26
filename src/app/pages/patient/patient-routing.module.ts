import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AppointmentsComponent } from './appointments/appointments.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    {
        path: "my",
        canActivate: [AuthGuard],
        children: [
            { path: "appointments", component: AppointmentsComponent },
            { path: "dashboard", component: DashboardComponent },
            { path: "**", redirectTo: "dashboard" },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PatientRoutingModule { }
