import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { atLeastOneCheckboxCheckedValidator } from '../../validator/at-least-one-validator'
import { AdminService } from '../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { strictEmailValidator } from '../../validator/email-validator';
import { strictStringValidator } from '../../validator/strict-string-validator';

@Component({
  selector: 'app-add-delegate',
  templateUrl: './add-delegate.component.html',
  styleUrls: ['./add-delegate.component.css']
})
export class AddDelegateComponent implements OnInit {
  registrationForm: FormGroup;
  sponsorshipId!: string;
  selectedCountryObj:any={};
  selectedStateObj:any ={};
  selectedCityObj:any ={};

  countryCode: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  maxDate: string = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder,
                  private route: ActivatedRoute,
                  private router: Router,
                  private adminService: AdminService,
                    private ngxService: NgxUiLoaderService,
                    private SharedService: SharedService
  ) {}

  ngOnInit(): void {

    this.sponsorshipId = this.route.snapshot.paramMap.get('id');
    this.setupCountry();
    this.getAllCountrycode();
    const mobilePattern = /^[1-9]\d{9,14}$/;
    // Define the form group with controls and validations
    this.registrationForm = this.fb.group({
      // Personal Information Section
      title: ['', [Validators.required, Validators.maxLength(15),strictStringValidator()]],
      first_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(115),strictStringValidator()]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(115),strictStringValidator()]],
      dob: ['', [Validators.required,this.noFutureDateValidator]],

      // Contact Information Section
      countryCode: ['', [Validators.required]],
      pocMobile: ['', [Validators.required, Validators.pattern(mobilePattern)]],
      email_id: ['', [Validators.required, strictEmailValidator(), Validators.maxLength(125)]],

      linkedIn: ['', Validators.maxLength(150)],
      instagram: ['', Validators.maxLength(150)],

      // Professional Information Section
      profession_1: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150) ,strictStringValidator()]],
      profession_2: ['', Validators.maxLength(150)],

      website: ['', Validators.maxLength(150)],
      orgName: ['', Validators.maxLength(150)],

      // Address Details Section
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      address: [''],

      // Reference Code Section
      reference_no: ['', [Validators.minLength(3), Validators.maxLength(50)]],

      // Attendee Purpose Section
      attendee_purpose: ['', Validators.required],

      // Conference Interests Section: using a nested FormGroup for checkboxes
      conference_interest: this.fb.group({
        justice: [false],
        love: [false],
        peace: [false]
      } , { validators: atLeastOneCheckboxCheckedValidator })
    });
  }

  get justiceControl(): FormControl {
    return this.registrationForm.get('conference_interest')?.get('justice') as FormControl;
  }

  get loveControl(): FormControl {
    return this.registrationForm.get('conference_interest')?.get('love') as FormControl;
  }

  get peaceControl(): FormControl {
    return this.registrationForm.get('conference_interest')?.get('peace') as FormControl;
  }

  onCountryChange(event: Event): void{

    const selectedElement = event.target as HTMLSelectElement;
    const selectedName = selectedElement.selectedOptions[0].dataset.name;
    const selectedCode = selectedElement.selectedOptions[0].dataset.code;

    this.selectedCountryObj = {
      id:selectedElement.value,
      name:selectedName,
      code:selectedCode
    };

    this.callStateByIdApi(selectedElement.value);
  }

  callStateByIdApi(selectedId:any){
    this.adminService.getStateById(selectedId).subscribe((data: any) => {
      this.states = data['data'];
    },
    (error: any) => {
      console.log(error);
    }
    )
  }

  onStateChange(event: Event): void{
    const selectedElement = event.target as HTMLSelectElement;
    const selectedName = selectedElement.selectedOptions[0].dataset.name;

    this.selectedStateObj = {
      id:selectedElement.value,
      name:selectedName,
    }

    this.callCityByIdApi(selectedElement.value);
  }

  callCityByIdApi(selectedId:any){
    this.adminService.getCityById(selectedId).subscribe((data: any) => {
      this.cities = data['data'];
    },
    (error: any) => {
      console.log(error);
    }
    )
  }

  onCityChange(event: Event): void{
    const selectedElement = event.target as HTMLSelectElement;
    const selectedId = selectedElement.selectedOptions[0].dataset.name;

    this.selectedCityObj = {
      id:selectedElement.value,
      name:selectedId,
    }

  }

  // Called when the form is submitted
  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Form Submitted Successfully:', this.registrationForm.value);
      const formData = this.registrationForm.value;
        // Conference Interests Section: using a nested FormGroup for checkboxes

        const payload:any = {
        title: formData["title"],
        first_name: formData["first_name"],
        last_name: formData["last_name"],
        dob: formData["dob"],
        country_code:formData["countryCode"],
        mobile_number: formData["pocMobile"],
        email_id: formData["email_id"],
        linkedIn_profile: formData["linkedIn"],
        instagram_proafile: formData["instagram"],
        profession_1: formData["profession_1"],
        profession_2: formData["profession_2"],
        website: formData["website"],
        organization_name: formData["orgName"],
        address: formData["address"],
        country: formData["country"],
        state: formData["state"],
        city: formData["city"],
        passport_no: "",
        passport_issue_by: "",
        pin_code: null,
        reference_no: formData["reference_no"],
        attendee_purpose: "0",
        conference_lever_interest: Object.keys(formData["conference_interest"]).filter(key => formData["conference_interest"][key]),
        created_by: "Admin",
        status: "1",
        is_nomination:"0",
        p_type:"DELEGATE_OFFLINE",
        p_reference_by:this.sponsorshipId
    };
    
      this.ngxService.start();
        this.adminService.addDeletgate(payload).subscribe((data: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('Delegate added successfully', 'Delegate', 'success');
          this.resetForm();
        },
        (error: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('Oops failed to add delegate', 'Delegate', 'error');
        }
        )
      // Process form submission here (e.g., send to server)
    } else {
      // Mark all controls as touched to display validation errors
      this.registrationForm.markAllAsTouched();
      console.error('Form is invalid');
    }
  }

  resetForm() :void{
    this.registrationForm.reset({
      sponsorshipType: "",
      
    });
    this.registrationForm.markAsPristine();
    this.registrationForm.markAsUntouched();
  }

  setupCountry(): void{
    this.adminService.listCountry().subscribe((data: any) => {
      this.countries = data['data'];
    },
    (error: any) => {
      console.log(error);
    }
    )
  }

  getAllCountrycode() {
    this.adminService.getAllCountrycode().subscribe(
      (res: any) => {
        this.countryCode = res.data;
        const regex = /\(([^)]+)\)/;
        this.countryCode = this.countryCode.map(code => ({
          country_mobile_code: code.country_mobile_code,
          codeStr: (code.country_mobile_code.match(regex) || [])[1] || code.country_mobile_code
        }));
      },
      (err: any) => {
        console.log('error', err);
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/sponsorship']);  
  }

  noFutureDateValidator(control: any) {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    return selectedDate > today ? { futureDate: true } : null;
  }
}
