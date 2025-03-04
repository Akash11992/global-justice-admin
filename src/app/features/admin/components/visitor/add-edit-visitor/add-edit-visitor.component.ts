import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Location } from '@angular/common';

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

  countries: any[] = [];
  types: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private ngxService: NgxUiLoaderService,
    private SharedService: SharedService,
    private route: ActivatedRoute,
    private router:Router,
    private location: Location
  ) {
    this.mainForm = this.fb.group({
      visitorForms: this.fb.array([this.createVisitorForm()])
    });
  }

  ngOnInit(): void {
    this.visitorId = this.route.snapshot.paramMap.get('id');
    this.setupCountry();
    this.setupType();

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
      visitorForms.push(this.fb.group({
        full_name: [visitor.full_name, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]{1,50}$/)]],
        mobile_no: [visitor.mobile_no, [Validators.required, Validators.pattern(/^\+[1-9]\d{9,14}$/)]],
        email: [visitor.email, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+([._%+-]*[A-Za-z0-9]+)*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)]],
        country: [visitor.country, Validators.required],
        country_id: [visitor.country_id, Validators.required],
        type: [visitor.type, Validators.required],
        type_id: [visitor.type_id, Validators.required]
      }));
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

  setupType(): void {
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
    
    const namePattern = /^(?! )[a-zA-Z0-9 -]{0,48}(?<! )$/;
    const emailPattern = /^[A-Za-z0-9]+([._%+-]*[A-Za-z0-9]+)*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const mobilePattern = /^\+[1-9]\d{9,14}$/;

    return this.fb.group({
      full_name: ['', [Validators.required, Validators.pattern(namePattern)]],
      mobile_no: ['', [Validators.required, Validators.pattern(mobilePattern)]],
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      country: ['', Validators.required],
      country_id: ['', Validators.required],
      type: ['', Validators.required],
      type_id: ['', Validators.required]
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
          },
          (error: any) => {
            this.ngxService.stop();
            this.SharedService.ToastPopup('Failed to add visitor', 'Visitor', 'error');
          }
        );
      }
    } else {
      console.error('Form is invalid');
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
    this.router.navigate(['/dashboard/visitor']);  
    // this.location.back();
  }
}
