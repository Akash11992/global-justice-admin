import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Location } from '@angular/common';
import { UserPermissionsService } from 'src/app/core/interceptors/user-permissions.service';

@Component({
  selector: 'app-add-edit-visitor',
  templateUrl: './add-edit-visitor.component.html',
  styleUrls: ['./add-edit-visitor.component.css']
})

export class AddEditVisitorComponent implements OnInit {
  mainForm: FormGroup;
  maxForms: number = 9;
  isEditMode: boolean = false; // Flag to check if the form is in edit mode
  visitorId!: string;
  userPermissions: any;
  countries: any[] = [];
  types: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private ngxService: NgxUiLoaderService,
    private SharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private permissionsService: UserPermissionsService

  ) {
    this.getUserPermission();

    this.mainForm = this.fb.group({
      visitorForms: this.fb.array([this.createVisitorForm()])
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getUserPermission();

    this.visitorId = this.route.snapshot.paramMap.get('id');
   await this.setupCountry();
   await this.setupType();

    // Check if the form is in edit mode
    if (this.visitorId) {
      this.isEditMode = true;
      this.fetchVisitorDetails(this.visitorId);
    }
  }

  fetchVisitorDetails(visitorId: string): void {
    this.ngxService.start();
    this.adminService.getVisitorById(visitorId).subscribe(
      (data: any) => {
        this.ngxService.stop();
        this.populateForm([data.data]);
      },
      (error: any) => {
        this.ngxService.stop();
        this.SharedService.ToastPopup('Failed to fetch visitor details', 'Visitor', 'error');
      }
    );
  }

  populateForm(visitorData: any): void {
    const visitorForms = this.mainForm.get('visitorForms') as FormArray;
    visitorForms.clear(); // Clear existing forms

    visitorData.forEach((visitor: any) => {
      const defaultCountry = 'United Arab Emirates';
      const defaultCountryObj = this.countries.find(c => c.name === defaultCountry);
      visitorForms.push(this.fb.group({
        full_name: [visitor.full_name, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]{1,50}$/)]],
        mobile_no: [visitor.mobile_no, [Validators.pattern(/^\+[1-9]\d{9,14}$/)]],
        email: [visitor.email, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+([._%+-]*[A-Za-z0-9]+)*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)]],
        country: [visitor.country || defaultCountry, Validators.required],
        country_id: [visitor.country_id || defaultCountryObj?.id, Validators.required],
        type: [visitor.type, Validators.required],
        type_id: [visitor.type_id, Validators.required],
        is_admin: [this.userPermissions.view ? 0 : 1]

      }));
    });


  }

 async setupCountry(): Promise<void> {
    this.adminService.listCountry().subscribe(
      (data: any) => {

        // this.countries = data['data'];


        const allCountries = data['data'];

        // Manually extract UAE and India in desired order
        const uaeCountry = allCountries.find((c: { name: string }) => c.name === 'United Arab Emirates');
        const indiaCountry = allCountries.find((c: { name: string }) => c.name === 'India');

        // Filter out UAE and India from the rest
        const restCountries: { name: string }[] = allCountries.filter(
          (c: { name: string }) => c.name !== 'United Arab Emirates' && c.name !== 'India'
        );

        // Sort rest alphabetically
        restCountries.sort((a, b) => a.name.localeCompare(b.name));

        // Merge countries: UAE first, India second, then rest
        this.countries = [];
        if (uaeCountry) this.countries.push(uaeCountry);
        if (indiaCountry) this.countries.push(indiaCountry);
        this.countries.push(...restCountries);

        // Set default selected value as UAE
        const visitorForms = this.mainForm.get('visitorForms') as FormArray;
        if (visitorForms.length > 0) {
          const firstForm = visitorForms.at(0);
          const uaeCountry = this.countries.find(country => country.name === 'United Arab Emirates');
          if (uaeCountry) {
            firstForm.get('country')?.setValue(uaeCountry.name);
            firstForm.get('country_id')?.setValue(uaeCountry.id);
          }
        }


      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  async setupType(): Promise<void> {
    this.adminService.listVisitorType().subscribe(
      (data: any) => {
        this.types = data['data'];
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onCountryChange(event: Event, formIndex: number): void {
    const selectedElement = event.target as HTMLSelectElement;
    const id = selectedElement.selectedOptions[0].dataset.id;

    const formGroup = this.visitorFormsArray.at(formIndex);
    formGroup.get('country_id')?.setValue(id);
  }

  onTypeChange(event: Event, formIndex: number): void {
    const selectedElement = event.target as HTMLSelectElement;
    const id = selectedElement.selectedOptions[0].dataset.id;

    const formGroup = this.visitorFormsArray.at(formIndex);
    formGroup.get('type_id')?.setValue(id);
  }


  get visitorFormsArray(): FormArray {
    return this.mainForm.get('visitorForms') as FormArray;
  }

  createVisitorForm(): FormGroup {

    const namePattern = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9 .-]{1,50}$/;
    const emailPattern = /^[A-Za-z0-9]+([._%+-]*[A-Za-z0-9]+)*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const mobilePattern = /^[0-9]\d{9,14}$/;
    const defaultCountry = 'United Arab Emirates';
    const defaultCountryObj = this.countries.find(c => c.name === defaultCountry);

    return this.fb.group({
      full_name: ['', [Validators.required, Validators.pattern(namePattern)]],
      mobile_no: ['',],
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      country: [defaultCountry, Validators.required],
      country_id: [defaultCountryObj?.id, Validators.required],
      type: ['', Validators.required],
      type_id: ['', Validators.required],
      is_admin: [this.userPermissions.view ? 0 : 1]
    });
  }


  addForm(): void {
    if (this.visitorFormsArray.length < this.maxForms) {
      this.visitorFormsArray.push(this.createVisitorForm());
    }
  }

  removeLastForm(): void {
    if (this.visitorFormsArray.length > 1) {
      const index = this.visitorFormsArray.length - 1;
      this.visitorFormsArray.removeAt(index);
    }
  }

  isAddDisabled(): boolean {
    return this.visitorFormsArray.length >= this.maxForms;
  }


  onSubmitAll(): void {
    this.mainForm.markAllAsTouched();

    if (this.mainForm.valid) {
      this.ngxService.start();
      const payload = {
        visitors: this.mainForm.value.visitorForms.map((visitor: any) => ({
          ...visitor,
        }))
      };

      if (this.isEditMode) {
        // Update existing visitor
        this.adminService.updateVisitor(this.visitorId, payload.visitors[0]).subscribe(
          (data: any) => {
            this.ngxService.stop();
            this.SharedService.ToastPopup('Visitor updated successfully', 'Visitor', 'success');

              // Redirect to the visitor list page after a delay
              this.router.navigate(['dashboard/visitor']);
          },
          (error: any) => {
            this.ngxService.stop();
            this.SharedService.ToastPopup('Failed to update visitor', 'Visitor', 'error');
          }
        );
      } else {
        // Add new visitor
        this.adminService.addBulkVisitor(payload).subscribe(
          (data: any) => {
            this.ngxService.stop();
            this.resetForm();
            this.SharedService.ToastPopup('Visitor added successfully', 'Visitor', 'success');
                  
              // Redirect to the visitor list page after a delay
              this.router.navigate(['dashboard/visitor']);
          },
          (error: any) => {
            this.ngxService.stop();
            this.SharedService.ToastPopup('Failed to add visitor', 'Visitor', 'error');
          }
        );
      }
    } else {
      // console.error('Form is invalid');
    }
  }

  resetForm() {
    this.mainForm.reset(); // Resets all values in the form
    this.setDefaultVisitorForm(); // Ensures at least one Visitor form remains
  }

  setDefaultVisitorForm() {
    const visitorForms = this.mainForm.get('visitorForms') as FormArray;
    visitorForms.clear(); // Remove all existing Visitor forms
    visitorForms.push(this.createVisitorForm()); // Add a fresh Visitor form
  }

  private getMaxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }


  onCancel(): void {
    this.router.navigate(['dashboard/visitor']);
    // this.location.back();
  }
  async getUserPermission() {
    // Get user data from localStorage
    const decryptUserData = this.SharedService.decryptData(localStorage.getItem('userDetails') || '{}');
    const userData = JSON.parse(decryptUserData);
    // let userData = JSON.parse(localStorage.getItem('userDetails'));

    this.permissionsService.getUserPermissions(userData.email);

    // Use in-memory permissions instead of localStorage to prevent tampering
    this.userPermissions = this.permissionsService.getStoredPermissions();

  }

  validateAlpha(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const key = event.key;
    const currentValue = input.value;
    const cursorPos = input.selectionStart;

    // Block space at the beginning
    if (key === ' ' && (cursorPos === 0 || currentValue === '')) {
      event.preventDefault();
      return;
    }

    // Allow letters, spaces (not at start),
    const allowedPattern = /^[a-zA-Z\s\'‘]$/;
    if (!allowedPattern.test(key)) {
      event.preventDefault();
    }
  }

  keyPressNumbers(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const key = event.key;
    const currentValue = input.value;
    const cursorPos = input.selectionStart;

    // Block space at the beginning
    if (key === ' ' && (cursorPos === 0 || currentValue === '')) {
      event.preventDefault();
      return;
    }
 
    // Allow Backspace, Delete, Arrow keys for user convenience
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowedKeys.includes(event.key)) {
      return; // Allow these keys
    }
    if (!/^[0-9]$/.test(event.key) && event.key !== '+') {
      event.preventDefault();
    }
  }
}
