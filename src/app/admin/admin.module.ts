import { NgModule ,  NO_ERRORS_SCHEMA } from '@angular/core';
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
import { PeacekeeperUserComponent } from './components/peacekeeper-user/peacekeeper-user.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { DiscountCoupanMasterComponent } from './components/discount-coupan-master/discount-coupan-master.component';
import { AddDiscountCoupanComponent } from './components/add-discount-coupan/add-discount-coupan.component';
import { QRCodeModule } from 'angularx-qrcode';
import { TooltipModule } from 'ng2-tooltip-directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
    BroucherComponent,
    PeacekeeperUserComponent,
    ContactUsComponent,
    DiscountCoupanMasterComponent,
    AddDiscountCoupanComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    CanvasJSAngularChartsModule,
    QRCodeModule,
    TooltipModule,
    FontAwesomeModule,
    

  ],
  schemas: [NO_ERRORS_SCHEMA], // Add this line

})
export class AdminModule { }
