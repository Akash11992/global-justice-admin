import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from './features/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// import { SharedModule } from './shared/shared.module';


// import { HeaderComponent } from './shared/components/header/header.component';
// import { FormsModule,ReactiveFormsModule } from '@angular/forms';
// import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Constants } from './config/constant';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { AdminModule } from './admin/admin.module';
import { QRCodeModule } from 'angularx-qrcode';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImageViewerModule } from 'ngx-image-viewer'
// import { HeaderComponent } from './shared/components/header/header.component';
@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxCsvParserModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), 
    AuthModule,
    SharedModule,
    AdminModule,
    BrowserModule,
    ToastrModule.forRoot(),
    NgxUiLoaderModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,SharedModule,
    QRCodeModule,
    FontAwesomeModule,
    ImageViewerModule.forRoot()

  ],

  providers: [
    DatePipe,
    Constants,
    
    provideAnimations(),
    Constants,
    // {provide: LocationStrategy, useClass: HashLocationStrategy}

  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
