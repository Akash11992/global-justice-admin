import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-delegate-registration',
  templateUrl: './delegate-registration.component.html',
  styleUrls: ['./delegate-registration.component.css']
})
export class DelegateRegistrationComponent {
  mainForm: FormGroup;
  maxForms: number = 3;
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

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private ngxService: NgxUiLoaderService,
    private SharedService: SharedService
  ) {
    this.setupCountry();
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
    return this.fb.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      linkedIn: [''],
      instagram: [''],
      profession1: ['', Validators.required],
      profession2: [''],
      website: [''],
      organization: [''],
      address: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      referenceNumber: [''],
      purpose: ['', Validators.required],
      levers: this.fb.array([]) // Checkbox selection
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
  }

  onSubmitAll(): void {
    this.ngxService.start();
    this.mainForm.markAllAsTouched();

    if (this.mainForm.valid) {
      console.log('Form Submitted', this.mainForm.value);
      const payload ={
        delegateForms: this.mainForm.value.delegateForms.map((delegate: any) => ({
          ...delegate, // Spread the existing properties
          passport_no: "", // Add the new attribute
          passport_issue_by: "", // Add the new attribute
          status: "0", // Add the new attribute
          created_by: "Admin", // Add the new attribute
          p_type: "DELEGATE_SPONSERED", // Add the new attribute
          p_reference_by: 10 // Add the new attribute
        }))
      };
      this.adminService.addDeletgates(payload).subscribe((data: any) => {
        this.ngxService.stop();
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
}
