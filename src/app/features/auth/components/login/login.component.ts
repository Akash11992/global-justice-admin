import { AfterViewInit, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AdminService } from 'src/app/features/admin/services/admin.service';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit  {

  loginForm!: FormGroup;
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "bi-eye-slash"
  private readonly AUTH_KEY = 'isLoggedIn';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);




  constructor(
    private _fb: FormBuilder,
    private adminService: AdminService,

    private router: Router,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService,
  ) { 
    const isLoggedIn = localStorage.getItem(this.AUTH_KEY) === 'true';
    this.isAuthenticatedSubject.next(isLoggedIn);
  }


  ngOnInit(): void {
    // Set up form configurations
    localStorage.clear();
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
      password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]]
    });
  }

  // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') emailvalidation

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "bi-eye-fill" : this.eyeIcon = "bi-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  // onLogin() {
  //   console.log('Logging in with', this.username, this.password);
  // }

  // Function to submit the form data
  onLogin() {

    let encryptedEmail = this.SharedService.encryptData({
      "email": this.loginForm.controls['email'].value,
      "password": this.loginForm.controls['password'].value,
    });

    let loginData = {
      "encrypted_data": encryptedEmail
    }

    // Log the loginData object for debugging purposes
    console.log(loginData + "loginData");

    this.ngxService.start();
    // Call the ProfileService to post the OTP and password data
    this.adminService.login(loginData).subscribe((res: any) => {
      this.ngxService.stop();
      // localStorage.setItem(this.AUTH_KEY, 'true');
      localStorage.setItem('authToken', res.token);
      // Display success message after successful OTP submission
      this.SharedService.ToastPopup('You have logged in successfully!', '', 'success');
      this.isAuthenticatedSubject.next(true);
      const decreptedToken = this.SharedService.decryptData(res.token);
      const decreptedUser = JSON.parse(this.SharedService.decryptData(res.data))
      const userData = {
        name : decreptedUser.name,
        email : decreptedUser.email,
        admin_id : decreptedUser.admin_id,
      }
      // Store the encrypted token
      this.SharedService.setJWTToken(decreptedToken);
      this.SharedService.setUserDetails(JSON.stringify(userData));
      this.ngxService.stop();



      // Redirect to the login page after a delay
      setTimeout(() => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/dashboard']));
      }, 2000);
    }, (err) => {
      this.ngxService.stop();

      // Display error message if OTP is not found or there's an error in API call
      this.SharedService.ToastPopup('User not found!', '', 'error');
    })
  }

  


  ngAfterViewInit() {
    const inputs = document.querySelectorAll<HTMLInputElement>(".input");

    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        let parent = input.parentNode?.parentNode as HTMLElement;
        parent?.classList.add("focus");
      });

      input.addEventListener("blur", () => {
        let parent = input.parentNode?.parentNode as HTMLElement;
        if (input.value === "") {
          parent?.classList.remove("focus");
        }
      });
    });
  }
}


