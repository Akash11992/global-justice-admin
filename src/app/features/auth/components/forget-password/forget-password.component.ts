import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AdminService } from 'src/app/admin/services/admin.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  loginForm!: FormGroup;
  type: string = "password";
  type1: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  eyeIcon1: string = "fa-eye-slash"

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
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: [null, [Validators.required, Validators.maxLength(6), Validators.minLength(6), Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
      confirmPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c), Validators.pattern('^((?!.*[s])(?=.*[A-Z])(?=.*d).{8,99})'),]),
    }, { validators: this.passwordMatchValidator })
  }




   // Custom validator function to check if password and confirm password match
   passwordMatchValidator(formGroup: FormGroup<any>) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  // Function to toggle confirm password visibility
  hideShow() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon1 = "fa-eye" : this.eyeIcon1 = "fa-eye-slash";
    this.isText ? this.type1 = "text" : this.type1 = "password";
  }


  // Function to submit the form data
  verify() {
    debugger
    let loginData = {
      otp: this.loginForm.controls['otp'].value,
      password: this.loginForm.controls['password'].value,
      // password: this.loginForm.controls['password'].value,
    }

    // Log the loginData object for debugging purposes
    console.log(loginData.otp + "loginData");

    this.ngxService.start();
    // Call the ProfileService to post the OTP and password data
    this.adminService.fillotp(loginData).subscribe((res: any) => {
      this.ngxService.stop();

      // Display success message after successful OTP submission
      this.SharedService.ToastPopup('Your password has changed successfully!', '', 'success');

      // Redirect to the login page after a delay
      setTimeout(() => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/login']));
      }, 2000);
    }, (err) => {
      this.ngxService.stop();

      // Display error message if OTP is not found or there's an error in API call
      this.SharedService.ToastPopup("OTP didn't match!", '', 'error');
    })
  }


  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}
