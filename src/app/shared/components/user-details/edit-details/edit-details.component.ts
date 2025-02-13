import { Component } from '@angular/core';
import { AdminService } from 'src/app/features/admin/services/admin.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControlName, FormBuilder, FormArray, AbstractControl, ValidatorFn, } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css']
})
export class EditDetailsComponent {
  refer:any;
  isOthersSelected:any;
  othervalstate: any='';
  othervalstate_id:any='';
  
  othervalcity: any='';
  othervalcity_id:any='';
  code:any;
  website: string = '';
  submitted = false;
  getdata: any;
  is_registered_user:boolean=true;
  registrationForm: any = FormGroup;
  country_id: any
  state_id: any
  countryData: any;
  statesData: any;
  cityData: any;
  city_id: any;
  user_id:any;
  mobile_number: string = '';
  inputValue: string = ''; 
  constructor( private ngxService: NgxUiLoaderService,private router: Router,private fb: FormBuilder,private AdminService: AdminService,private SharedService: SharedService,private route: ActivatedRoute)
{

}
getcontrol(name: any): AbstractControl | null {
  return this.registrationForm.get(name);
}
get f() { return this.registrationForm.controls; }
  ngOnInit(): void {
  this.createForm();
  this.getAllCountries()

  
    this.getUserByid();
  this.getAllCountrycode();
  }

  createForm(){
    this.registrationForm = this.fb.group({
      title: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      department: [''],
      designation: ['', [Validators.required]],
      country_code: ['', [Validators.required]],

      mobile_number: ['', [
        Validators.required,
        Validators.pattern(/^(?!.*(\d)\1{9})(\d{10})$/), // Checks for no repeated digits
        this.noRepeatingDigits(), this.containsConsecutiveZeros()
      ]],
      email_id: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)]], // Using Validators.email for email format validation
      company_name: ['', [Validators.required]],
      company_address: [''],
      address_line_1: ['', [Validators.required]],
      address_line_2: [''],
      address_line_3: [''],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pin_code: ['', [Validators.required, Validators.pattern(/^\d{6}$/), this.containsConsecutiveZeros()]],
      website: ['', [Validators.pattern('https?://.+')]], // Basic URL pattern validation
      conference_day: ['', [Validators.required]],
      // organization_role: [''],
      // represent_pharmaceutical_industry: ['', [Validators.required]],
      // manufacturing_solution_PI: ['', [Validators.required]],
      // part_of_product: ['', [Validators.required]],
      attending_purpose: ['', [Validators.required]],
      specific_solution: ['', [Validators.required]],
      attended_innopack: ['', [Validators.required]],
      // firm_teamsize: [''],
      registration_type: ['1'],
      terms_condition: ['', [Validators.required]],
      is_whatsapp_number: ['', [Validators.required]],
      events: [''],
      
    });
  }
  getUserByid() {
      
     // Use ActivatedRoute to get the user_id parameter from the route
    this.route.params.subscribe(params => {
      this.user_id = params['user_id'];
      if (this.user_id) {
        let payload = { user_id: this.user_id }; // Set the user_id in your payload
        this.AdminService.getUserByid(payload).subscribe((data: any) => {
          // console.log("data", data.data);
          if (data && data.data !== undefined) {
            this.getdata = data.data[0][0];
            console.log("getbyid_editdetails",this.getdata);
            this.registrationForm.patchValue({
              title: this.getdata.title,
              first_name: this.getdata.first_name,
              last_name: this.getdata.last_name,
              designation:this.getdata.designation, 
              department: this.getdata.department, 
              country_code:this.getdata.country_code,
              mobile_number:this.getdata.mobile_number,
              company_name:this.getdata.company_name,
              email_id:this.getdata.email_id,
              company_address:this.getdata.company_address,
              address_line_1:this.getdata.address_line_1,
              address_line_2:this.getdata.email_id,
              address_line_3:this.getdata.address_line_3,
              country:this.getdata.country,
              state:this.getdata.state,
              city:this.getdata.city,
              pin_code:this.getdata.pin_code,
              website:this.getdata.website,
              conference_day:this.getdata.conference_day,
              attending_purpose:this.getdata.attending_purpose,
              attended_innopack:this.getdata.attended_innopack,
              specific_solution:this.getdata.specific_solution,
              is_whatsapp_number:this.getdata.is_whatsapp_number,
              events:this.getdata.events,
              terms_condition:this.getdata.terms_condition
              

            });
            this.notchangeCountry();
            this.notchangeStates(this.getdata.state);
console.log("a",this.registrationForm.value);

          }
        }, (err) => {
          console.error('Fetching operation failed:', err);
        });
      }
    });
    
  this.route.queryParams.subscribe(queryParams => {
    this.refer = queryParams['refer'];
    console.log("........page...",this.refer);
    
    if (this.refer==='non-registered-user') {
      console.log(".....true");
      
      this.is_registered_user=false;
    }
  });
  }

  containsConsecutiveZeros(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string;
      if (value && /000000/.test(value)) {
        return { containsConsecutiveZeros: true };
      }
      return null;
    };
  }

  
  noRepeatingDigits(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string;
      if (value && value.length === 10) {
        // Check for repeating digits
        const repeatingDigits = /(.)\1{5,}/.test(value);
        if (repeatingDigits) {
          return { repeatingDigits: true };
        }
      }
      return null;
    };
  }
  changeCountry(e: any) {
    this.country_id = e.target.value;
    this.country_id = e.target.value;
    this.isOthersSelected = this.country_id === '247'; // Set a flag for "Others"
    console.log(this.country_id);
    if(this.country_id==='247'){
      console.log("hii",this.country_id);
      this.SharedService.getAllStates(this.country_id).subscribe((res: any) => {
        this.ngxService.stop();
        this.statesData = res.data;
        console.log(this.statesData[0].state_name);
      this.othervalstate=this.statesData[0].state_name;
      this.othervalstate_id=this.statesData[0].state_id;
      this.registrationForm.patchValue({
          state:this.statesData[0].state_id
        })

        this.SharedService.getAllCities(this.othervalstate_id).subscribe((res: any) => {
          this.ngxService.stop();
          this.cityData = res.data;
          console.log(this.cityData[0].city_name);
          this.othervalcity=this.cityData[0].city_name;
          this.othervalcity_id=this.cityData[0].city_id;
          this.registrationForm.patchValue({
              city:this.cityData[0].city_id
            })
  
            console.log("c",this.registrationForm.value.city,this.othervalcity_id,this.othervalcity);
  
          }, (err: any) => {
            console.log("Err", err);
            this.ngxService.stop();
          });
  
    // this.otherval=    this.registrationForm.get('state')?.setValue(this.statesData[0].state_name);
      console.log("s",this.registrationForm.value.state,this.othervalstate_id,this.othervalstate);
      
      }, (err: any) => {
        console.log("Err", err);
        this.ngxService.stop();
      });
      
    }
    else{
      
      this.othervalstate_id='';
      this.othervalstate = '';
      this.othervalcity_id='';
      this.othervalcity='';
      console.log(typeof(this.othervalcity),this.othervalstate);
    this.ngxService.start();
    this.ngxService.start();
    this.SharedService.getAllStates(this.country_id).subscribe((res: any) => {
      this.ngxService.stop();
      this.statesData = res.data;
    }, (err: any) => {
      console.log("Err", err);
      this.ngxService.stop();
    });
  }
  }
  notchangeCountry() {
    this.country_id =101;
    this.ngxService.start();
    this.SharedService.getAllStates(this.country_id).subscribe((res: any) => {
      this.ngxService.stop();
      this.statesData = res.data;
    }, (err: any) => {
      console.log("Err", err);
      this.ngxService.stop();
    });
  }
  changeStates(e: any) {
    this.state_id = e.target.value;
    this.ngxService.start();
    this.SharedService.getAllCities(this.state_id).subscribe((res: any) => {
      this.ngxService.stop();
      this.cityData = res.data;
      this.changeCity(this.cityData.city_id)

    });
  }
  
  notchangeStates(e:any) {
    this.state_id = e;
    console.log("this.getdata.city",e);
    
    this.ngxService.start();
    this.SharedService.getAllCities(this.state_id).subscribe((res: any) => {
      this.ngxService.stop();
      this.cityData = res.data;
      console.log(this.cityData.city_id);
      
      this.changeCity(this.cityData.city_id)
    });
  }
  changeCity(e: any) {
    this.city_id = e;
    console.log("city", e);
  }
  submitForm(){
   
    console.log(this.registrationForm.value);

    this.submitted = true;
    if (this.registrationForm.invalid) {
      this.SharedService.ToastPopup('','Please fill the required fields!', 'error')

      return console.log('Invalid Details');
    }
    if (this.submitted) {

     

      const { valid } =
        this.registrationForm;
      if (valid) {
console.log(this.registrationForm.value.terms_condition,this.registrationForm.value.terms_condition);
console.log("events",this.registrationForm.value.events);

        if (this.registrationForm.value.terms_condition===0 ||this.registrationForm.value.terms_condition===false ) {
          // Display an error message for terms not accepted
          this.SharedService.ToastPopup('','Please accept the terms and conditions.!', 'error')

          console.log('Please accept the terms and conditions.');
          return;
        }
        else if(this.registrationForm.value.is_whatsapp_number===0||this.registrationForm.value.is_whatsapp_number===false ){
          this.SharedService.ToastPopup('','Please check the whatsapp number!', 'error')

          console.log('Please check the whatsapp number!');
        }
else{

      let payload = {
        user_id:this.user_id,
          ...this.registrationForm.value,
      updated_by:"admin"
        };
        console.log("this.registrationForm.value", this.registrationForm.value);

        this.ngxService.start();
        this.AdminService.update_user_details(payload).subscribe(async (result: any) => {
          if (result.success) {
            console.log("result", result);
            this.ngxService.stop();
            // this.SharedService.ToastPopup('Delegate added successfully','', 'success')
            this.SharedService.ToastPopup('', result.message, 'success')
  this.getUserByid();
 this.router.navigateByUrl(`/user/viewdetails/${this.user_id}?refer=registered-user`);
   

            // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            //   // this.router.navigateByUrl('/webhome');
            //   // Show the popup message
            // });
          } else {
            this.ngxService.stop();
            this.SharedService.ToastPopup('', result.message, 'error')
          }
        },
        );
      }
    }
    }
  }

  onKeyDown(event: KeyboardEvent, inputValue: string): void {
    // Check if the pressed key is the space bar and the input is empty
    console.log("key");
    
    if (event.key === ' ' && inputValue.trim() === '') {
      event.preventDefault(); // Prevent the space character from being typed
    }
  }
  
  getAllCountrycode() {
    this.SharedService.getAllCountrycode().subscribe((res: any) => {
      console.log("code", res.data);
      this.code = res.data;
      // Define the country name you want to find (e.g., "India (+91)")
// const countryToFind = "India (+91)";

// // Find the object that matches the country name
// const indiaCodeObject =  this.code.find((item:any) => item.country_mobile_code === countryToFind);
// console.log(indiaCodeObject);

//       this.registrationForm.patchValue({
//         country_code :indiaCodeObject.country_mobile_code
//       })
    }, (err: any) => {
      console.log("error", err);
    });
  }

  getAllCountries() {
    this.SharedService.getAllCountries().subscribe((res: any) => {
      console.log("CountryData1", res.data);
      this.countryData = res.data;
    }, (err: any) => {
      console.log("error", err);
    });
  }

  // Function to allow only numbers
  // Function to allow only numbers
  // Function to allow only numbers
//key press validation
keyPressNumbers(event: any) {
  var charCode = (event.which) ? event.which : event.keyCode;
  // Only Numbers 0-9
  if ((charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  } else {
    return true;
  }
}
}
