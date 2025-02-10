import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AdminService } from 'src/app/features/admin/services/admin.service';
@Component({
  selector: 'app-send-email-otp',
  templateUrl: './send-email-otp.component.html',
  styleUrls: ['./send-email-otp.component.css']
})
export class SendEmailOtpComponent {

  loginForm!: FormGroup;
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"

  constructor(
    private _fb: FormBuilder,
    private adminService: AdminService,

    private router: Router,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService,
  ) { }
  ngOnInit(): void {
    // Set up form configurations
    this._preConfig();
  }


  getcontrol(name: any): AbstractControl | null {
    return this.loginForm.get(name);
  }

  // Function to initialize form configurations
  private _preConfig() {
    this._createLoginForm();
  }

  // Function to create the login form
  private _createLoginForm() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]]
      // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') emailvalidation
    });
  }



  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }


  // Function to submit the form data
  postapi() {
    let loginData = {
      email: this.loginForm.controls['email'].value,
      // password: this.loginForm.controls['password'].value,
    }

    // Log the loginData object for debugging purposes
    // console.log(loginData.email + "loginData");

    this.ngxService.start();
    // Call the ProfileService to post the OTP and password data
    
    this.adminService.otpsend(loginData).subscribe((res: any) => {
      console.log("hggfgfgfc",res);
     
      
      
      // Display success message after successful OTP submission
      this.SharedService.ToastPopup(res.message, '', 'success');
 this.ngxService.stop();
      // Redirect to the login page after a delay
      setTimeout(() => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/forgot-password']));
      }, 2000);
    }, (err) => {
      this.ngxService.stop();

      // Display error message if OTP is not found or there's an error in API call
      this.SharedService.ToastPopup('User not found, Please enter correct detail', '', 'error');
    })
  }

}
