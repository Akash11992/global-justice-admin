import { NgModule } from "@angular/core";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { RouterModule, Routes } from "@angular/router";
import { AdminMainComponent } from "./components/admin-main/admin-main.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { NonRegisteredUserComponent } from "./components/non-registered-user/non-registered-user.component";
import { RegisteredUserComponent } from "./components/registered-user/registered-user.component";
import { ViewTrackingListComponent } from "./components/tracking-list/view-tracking-list/view-tracking-list.component";
import { AddTrackingListComponent } from "./components/tracking-list/add-tracking-list/add-tracking-list.component";
import { SalesBroucherComponent } from "./components/feature/sales-broucher/sales-broucher.component";
import { JoinmailinglistComponent } from "./components/feature/joinmailinglist/joinmailinglist.component";
import { BroucherComponent } from "./components/feature/broucher/broucher.component";
import { ViewDetailsComponent } from "../../shared/components/user-details/view-details/view-details.component";
import { EditDetailsComponent } from "../../shared/components/user-details/edit-details/edit-details.component";
import { PeacekeeperUserComponent } from "./components/peacekeeper-user/peacekeeper-user.component";
import { ContactUsComponent } from "./components/contact-us/contact-us.component";
import { DiscountCoupanMasterComponent } from "./components/discount-coupan-master/discount-coupan-master.component";
import { AddDiscountCoupanComponent } from "./components/add-discount-coupan/add-discount-coupan.component";
import { SponsorshipComponent } from "./components/sponsorship/sponsorship.component";
import { AddSponsorshipComponent } from "./components/add-sponsorship/add-sponsorship.component";
import { CollaboratorComponent } from "./components/collaborator/collaborator.component";
import { AddCollaboratorComponent } from "./components/add-collaborator/add-collaborator.component";
import { DelegateComponent } from "./components/delegate/delegate.component";
import { AddDelegateComponent } from "./components/add-delegate/add-delegate.component";
import { AddDelegateByFileComponent } from "./components/add-delegate-by-file/add-delegate-by-file.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: AdminMainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", component: DashboardComponent },
      { path: "joinmailinglist", component: JoinmailinglistComponent ,canActivate: [AuthGuard],},
      { path: "broucher", component: BroucherComponent ,canActivate: [AuthGuard],},
      { path: "sales-broucher", component: SalesBroucherComponent ,canActivate: [AuthGuard],},
      {
        path: "discount-coupon-master",
        component: DiscountCoupanMasterComponent , canActivate: [AuthGuard],
      },
      {path:'add-discount-coupon',component:AddDiscountCoupanComponent , canActivate: [AuthGuard],},
      // {path:'reset-password',component:ResetPasswordComponent},
      //  {path:'non-registered-user',component:NonRegisteredUserComponent},

      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  {
    path: "dashboard",
    component: AdminMainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "non-registered-user", component: NonRegisteredUserComponent,canActivate: [AuthGuard], },
      // {path:'reset-password',component:ResetPasswordComponent},
      { path: "", redirectTo: "non-registered-user", pathMatch: "full" },
    ],
  },
  {
    path: "dashboard",
    component: AdminMainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "registered-user", component: RegisteredUserComponent,canActivate: [AuthGuard], },
      { path: "peacekeeper", component: PeacekeeperUserComponent,canActivate: [AuthGuard], },
      { path: "sponsorship", component: SponsorshipComponent,canActivate: [AuthGuard], },
      { path: "add-sponsorship", component: AddSponsorshipComponent,canActivate: [AuthGuard], },
      { path: "edit-sponsorship/:id", component: AddSponsorshipComponent,canActivate: [AuthGuard], },
      { path: "collaborator", component: CollaboratorComponent,canActivate: [AuthGuard], },
      { path: "add-collaborator", component: AddCollaboratorComponent,canActivate: [AuthGuard], },
      { path: "edit-collaborator/:id", component: AddCollaboratorComponent,canActivate: [AuthGuard], },
      { path: "delegate", component: DelegateComponent,canActivate: [AuthGuard], },
      { path: "add-delegate/:id", component: AddDelegateComponent,canActivate: [AuthGuard], },
      { path: "add-delegate-by-file", component: AddDelegateByFileComponent,canActivate: [AuthGuard], },
      { path: "contact-us", component: ContactUsComponent,canActivate: [AuthGuard], },
      // {path:'reset-password',component:ResetPasswordComponent},
      { path: "", redirectTo: "registered-user", pathMatch: "full" },
    ],
  },
  {
    path: "dashboard",
    component: AdminMainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "tracking-link", component: ViewTrackingListComponent ,canActivate: [AuthGuard], },
      {
        path: "tracking-link/add-tracking-link",
        component: AddTrackingListComponent,
        canActivate: [AuthGuard],
      },
      // {path:'reset-password',component:ResetPasswordComponent},
      { path: "", redirectTo: "tracking-link", pathMatch: "full" },
    ],
  },
  {
    path: "user",
    component: AdminMainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "viewdetails/:user_id", component: ViewDetailsComponent ,canActivate: [AuthGuard],},
      { path: "editdetails/:user_id", component: EditDetailsComponent ,canActivate: [AuthGuard],},

      // {path:'reset-password',component:ResetPasswordComponent},
      { path: "", redirectTo: "viewdetails", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
