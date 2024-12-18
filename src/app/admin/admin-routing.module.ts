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
import { ViewDetailsComponent } from "../shared/components/user-details/view-details/view-details.component";
import { EditDetailsComponent } from "../shared/components/user-details/edit-details/edit-details.component";
import { PeacekeeperUserComponent } from "./components/peacekeeper-user/peacekeeper-user.component";
import { ContactUsComponent } from "./components/contact-us/contact-us.component";
import { DiscountCoupanMasterComponent } from "./components/discount-coupan-master/discount-coupan-master.component";
import { AddDiscountCoupanComponent } from "./components/add-discount-coupan/add-discount-coupan.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: AdminMainComponent,

    children: [
      { path: "", component: DashboardComponent },
      { path: "joinmailinglist", component: JoinmailinglistComponent },
      { path: "broucher", component: BroucherComponent },
      { path: "sales-broucher", component: SalesBroucherComponent },
      {
        path: "discount-coupon-master",
        component: DiscountCoupanMasterComponent,
      },
      {path:'add-discount-coupon',component:AddDiscountCoupanComponent},
      // {path:'reset-password',component:ResetPasswordComponent},
      //  {path:'non-registered-user',component:NonRegisteredUserComponent},

      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  {
    path: "dashboard",
    component: AdminMainComponent,

    children: [
      { path: "non-registered-user", component: NonRegisteredUserComponent },
      // {path:'reset-password',component:ResetPasswordComponent},
      { path: "", redirectTo: "non-registered-user", pathMatch: "full" },
    ],
  },
  {
    path: "dashboard",
    component: AdminMainComponent,

    children: [
      { path: "registered-user", component: RegisteredUserComponent },
      { path: "peacekeeper", component: PeacekeeperUserComponent },
      { path: "contact-us", component: ContactUsComponent },
      // {path:'reset-password',component:ResetPasswordComponent},
      { path: "", redirectTo: "registered-user", pathMatch: "full" },
    ],
  },
  {
    path: "dashboard",
    component: AdminMainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "tracking-link", component: ViewTrackingListComponent },
      {
        path: "tracking-link/add-tracking-link",
        component: AddTrackingListComponent,
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
      { path: "viewdetails/:user_id", component: ViewDetailsComponent },
      { path: "editdetails/:user_id", component: EditDetailsComponent },

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
