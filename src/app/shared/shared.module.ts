import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { SharedRoutingModule } from './shared-routing.module';
import { AdminLeftPanelComponent } from './components/admin-left-panel/admin-left-panel.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminFooterComponent } from './components/admin-footer/admin-footer.component';
import { EditDetailsComponent } from './components/user-details/edit-details/edit-details.component';
import { ViewDetailsComponent } from './components/user-details/view-details/view-details.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    
    AdminLeftPanelComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    ViewDetailsComponent,
    EditDetailsComponent
  ],
  imports: [
    CommonModule,
    ToastrModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  exports:[
 
    AdminLeftPanelComponent,
    AdminHeaderComponent,
    AdminFooterComponent
  ]
})
export class SharedModule { }