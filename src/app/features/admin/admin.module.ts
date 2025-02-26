import { NgModule ,  NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisteredUserComponent } from './components/registered-user/registered-user.component';
import { NonRegisteredUserComponent } from './components/non-registered-user/non-registered-user.component';

import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { SharedModule } from '../../shared/shared.module';

import { AddTrackingListComponent } from './components/tracking-list/add-tracking-list/add-tracking-list.component';
import { ViewTrackingListComponent } from './components/tracking-list/view-tracking-list/view-tracking-list.component';
// import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
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
import { ImageViewerModule } from 'ngx-image-viewer';
import { SponsorshipComponent } from './components/sponsorship/sponsorship.component';
import { AddSponsorshipComponent } from './components/add-sponsorship/add-sponsorship.component';
import { CollaboratorComponent } from './components/collaborator/collaborator.component';
import { AddCollaboratorComponent } from './components/add-collaborator/add-collaborator.component';
import { DelegateComponent } from './components/delegate/delegate.component';
import { AddDelegateComponent } from './components/add-delegate/add-delegate.component';
import { AddDelegateByFileComponent } from './components/add-delegate-by-file/add-delegate-by-file.component';
import { UploadContactComponent } from './components/upload-contact/upload-contact.component';
import { ReviewContactComponent } from './components/review-contact/review-contact.component';
import { DelegateRegistrationComponent } from './components/delegate-registration/delegate-registration.component';

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
    AddDiscountCoupanComponent,
    SponsorshipComponent,
    AddSponsorshipComponent,
    CollaboratorComponent,
    AddCollaboratorComponent,
    DelegateComponent,
    AddDelegateComponent,
    AddDelegateByFileComponent,
    UploadContactComponent,
    ReviewContactComponent,
    DelegateRegistrationComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    // CanvasJSAngularChartsModule,
    QRCodeModule,
    TooltipModule,
    FontAwesomeModule,
    ImageViewerModule.forRoot()

  ],
  schemas: [NO_ERRORS_SCHEMA], // Add this line

})
export class AdminModule { }
