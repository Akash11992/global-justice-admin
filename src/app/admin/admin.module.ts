import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisteredUserComponent } from './components/registered-user/registered-user.component';
import { NonRegisteredUserComponent } from './components/non-registered-user/non-registered-user.component';

import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { SharedModule } from '../shared/shared.module';

import { AddTrackingListComponent } from './components/tracking-list/add-tracking-list/add-tracking-list.component';
import { ViewTrackingListComponent } from './components/tracking-list/view-tracking-list/view-tracking-list.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { JoinmailinglistComponent } from './components/feature/joinmailinglist/joinmailinglist.component';
import { SalesBroucherComponent } from './components/feature/sales-broucher/sales-broucher.component';
import { BroucherComponent } from './components/feature/broucher/broucher.component';
@NgModule({
  declarations: [
    DashboardComponent,
    RegisteredUserComponent,
    NonRegisteredUserComponent,
    AdminMainComponent,
    AddTrackingListComponent,
    ViewTrackingListComponent,
    JoinmailinglistComponent,
    SalesBroucherComponent,
    BroucherComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    CanvasJSAngularChartsModule,

  ]
})
export class AdminModule { }
