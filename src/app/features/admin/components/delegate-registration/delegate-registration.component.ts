import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delegate-registration',
  templateUrl: './delegate-registration.component.html',
  styleUrls: ['./delegate-registration.component.css']
})
export class DelegateRegistrationComponent {
  mainForm: FormGroup;
  maxForms: number = 9;
  conferenceInterests = [
    { label: 'Justice', value: 'justice' },
    { label: 'Love', value: 'love' },
    { label: 'Peace', value: 'peace' }
  ];

  countries: any[] = [];
  
  // Track states and cities independently for each delegate form
  delegateStates: any[] = [];
  delegateCities: any[] = [];
  
  // Store selected country, state, and city for each form
  selectedCountryObjs: { [key: number]: any } = {};
  selectedStateObjs: { [key: number]: any } = {};
  selectedCityObjs: { [key: number]: any } = {};
  maxDate: string; 
  sponsorshipId!: string;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private ngxService: NgxUiLoaderService,
    private SharedService: SharedService,
    private route: ActivatedRoute
  ) {

    this.sponsorshipId = this.route.snapshot.paramMap.get('id');
    this.setupCountry();
    this.maxDate = this.getMaxDate();
    this.mainForm = this.fb.group({
      delegateForms: this.fb.array([this.createDelegateForm()])
    });
  }

  setupCountry(): void {
    this.adminService.listCountry().subscribe(
      (data: any) => {
        this.countries = data['data'];
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onCountryChange(event: Event, formIndex: number): void {
    const selectedElement = event.target as HTMLSelectElement;
    const selectedName = selectedElement.selectedOptions[0].dataset.name;
    const selectedCode = selectedElement.selectedOptions[0].dataset.code;

    this.selectedCountryObjs[formIndex] = {
      id: selectedName ,
      name: selectedElement.value,
      code: selectedCode
    };

    // Clear state and city for this form
    this.delegateStates[formIndex] = [];
    this.delegateCities[formIndex] = [];
    this.selectedStateObjs[formIndex] = {};
    this.selectedCityObjs[formIndex] = {};

    // Reset form fields
    const formGroup = this.delegateFormsArray.at(formIndex);
    formGroup.get('state')?.setValue('');
    formGroup.get('city')?.setValue('');

    // Fetch states based on country
    this.callStateByIdApi(selectedName, formIndex);
  }

  callStateByIdApi(selectedId: any, formIndex: number): void {
    this.adminService.getStateById(selectedId).subscribe(
      (data: any) => {
        this.delegateStates[formIndex] = data['data'];
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onStateChange(event: Event, formIndex: number): void {
    const selectedElement = event.target as HTMLSelectElement;
    const selectedName = selectedElement.selectedOptions[0].dataset.name;

    this.selectedStateObjs[formIndex] = {
      id: selectedName ,
      name: selectedElement.value
    };

    // Clear city for this form
    this.delegateCities[formIndex] = [];
    this.selectedCityObjs[formIndex] = {};

    const formGroup = this.delegateFormsArray.at(formIndex);
    formGroup.get('city')?.setValue('');

    // Fetch cities based on state
    this.callCityByIdApi(selectedName, formIndex);
  }

  callCityByIdApi(selectedId: any, formIndex: number): void {
    this.adminService.getCityById(selectedId).subscribe(
      (data: any) => {
        this.delegateCities[formIndex] = data['data'];
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onCityChange(event: Event, formIndex: number): void {
    const selectedElement = event.target as HTMLSelectElement;
    const selectedName = selectedElement.selectedOptions[0].dataset.name;

    this.selectedCityObjs[formIndex] = {
      id: selectedName ,
      name: selectedElement.value
    };
  }

  get delegateFormsArray(): FormArray {
    return this.mainForm.get('delegateForms') as FormArray;
  }

  createDelegateForm(): FormGroup {
    
    const namePattern = /^[a-zA-Z0-9 -]{1,50}$/;
    const emailPattern = /^[A-Za-z0-9]+([._%+-]*[A-Za-z0-9]+)*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const mobilePattern = /^\+[1-9]\d{9,14}$/;

    return this.fb.group({
      title: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.pattern(namePattern)]],
      lastName: ['', [Validators.required, Validators.pattern(namePattern)]],
      dob: ['', [Validators.required, this.minimumAgeValidator(21)]],
      mobileNo: ['', [Validators.required, Validators.pattern(mobilePattern)]],
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      linkedIn: [''],
      instagram: [''],
      profession1: ['', [Validators.required,Validators.pattern(namePattern)]],
      profession2: [''],
      website: [''],
      organization: [''],
      address: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      referenceNumber: [''],
      purpose: ['', Validators.required],
      levers: this.fb.array([], this.minSelectedCheckboxes(1)) // Checkbox selection
    });
  }
  

  addForm(): void {
    if (this.delegateFormsArray.length < this.maxForms) {
      this.delegateFormsArray.push(this.createDelegateForm());
    }
  }

  removeLastForm(): void {
    if (this.delegateFormsArray.length > 1) {
      const index = this.delegateFormsArray.length - 1;
      delete this.selectedCountryObjs[index];
      delete this.selectedStateObjs[index];
      delete this.selectedCityObjs[index];
      this.delegateFormsArray.removeAt(index);
    }
  }

  isAddDisabled(): boolean {
    return this.delegateFormsArray.length >= this.maxForms;
  }

  minSelectedCheckboxes(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormArray)) {
        return null; // Ensure control is a FormArray
      }
  
      const selectedCount = control.controls.filter(ctrl => ctrl.value).length;
      return selectedCount >= min ? null : { required: true };
    };
  }

  toggleCheckbox(event: any, formIndex: number, value: string): void {
    const leversArray = this.delegateFormsArray.at(formIndex).get('levers') as FormArray;
  
    if (event.target.checked) {
      leversArray.push(this.fb.control(value));
    } else {
      const index = leversArray.controls.findIndex(control => control.value === value);
      if (index !== -1) {
        leversArray.removeAt(index);
      }
    }
  
    leversArray.markAsTouched(); // ✅ Ensure validation triggers on change
    leversArray.updateValueAndValidity();
  }
  

  onSubmitAll(): void {
    this.mainForm.markAllAsTouched();

    if (this.mainForm.valid) {
      this.ngxService.start();
      console.log('Form Submitted', this.mainForm.value);
      const payload ={
        delegateForms: this.mainForm.value.delegateForms.map((delegate: any) => ({
          ...delegate, // Spread the existing properties
          attendee_purpose: +delegate.attendee_purpose, // Spread the existing properties
          passport_no: "", // Add the new attribute
          passport_issue_by: "", // Add the new attribute
          status: "0", // Add the new attribute
          created_by: "Admin", // Add the new attribute
          p_type: "DELEGATE_SPONSERED", // Add the new attribute
          p_reference_by: +this.sponsorshipId // Add the new attribute
        }))
      };
      this.adminService.addDeletgates(payload).subscribe((data: any) => {
        this.ngxService.stop();
        this.resetForm();
        this.SharedService.ToastPopup('Delegate added successfully', 'Delegate', 'success');
      },
      (error: any) => {
        this.ngxService.stop();
        this.SharedService.ToastPopup('Oops failed to add delegate', 'Delegate', 'error');
      }
      )
      // Add your API call here to submit the form
    } else {
      console.log('Form Invalid');
      console.error('Form is invalid');
    }
  }

  resetForm() {
    this.mainForm.reset(); // Resets all values in the form
    this.setDefaultDelegateForm(); // Ensures at least one delegate form remains
  }
  
  setDefaultDelegateForm() {
    const delegateForms = this.mainForm.get('delegateForms') as FormArray;
    delegateForms.clear(); // Remove all existing delegate forms
    delegateForms.push(this.createDelegateForm()); // Add a fresh delegate form
  }

  private getMaxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }

  // Custom Validator: Minimum Age 21
  minimumAgeValidator(minAge: number) {
    return (control: AbstractControl) => {
      if (!control.value) return null; // If empty, let required validator handle it

      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();

      // Adjust for month/day differences
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--; // Birthday hasn't occurred yet this year
      }

      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }
}
