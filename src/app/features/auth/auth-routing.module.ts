import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SendEmailOtpComponent } from './components/send-email-otp/send-email-otp.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
const routes: Routes = [

  {
    path: '', 
    component: LoginComponent,

    children:[
      {path:'login',component:LoginComponent},
      {path:'', redirectTo:'/login', pathMatch:'full'}
    ]
  },
  {
      path:'send-otp',component:SendEmailOtpComponent
  },

  {
      path:'forgot-password',component:ForgetPasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
