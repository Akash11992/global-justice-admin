import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-sponsorship',
  templateUrl: './add-sponsorship.component.html',
  styleUrls: ['./add-sponsorship.component.css']
})
export class AddSponsorshipComponent implements OnInit{

  form: FormGroup;
  countries = ['USA', 'India', 'UK', 'Canada'];
  states = ['California', 'Texas', 'Florida', 'Maharashtra'];
  cities = ['Mumbai', 'New York', 'London', 'Toronto'];
  peacekeepers = ['PK001', 'PK002', 'PK003'];
  sponsorshipTypes = ['Type A', 'Type B', 'Type C'];
  refByOptions = ['peacekeeper', 'other'];
  private destroy$ = new Subject<void>();
  
  constructor(private fb: FormBuilder) {
    
  }

  ngOnInit() {
    this.initializeForm();
    this.setupConditionalValidation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm() {
    const mobilePattern = /^[0-9]{10}$/;
    const namePattern = /^[a-zA-Z ]+$/;

    this.form = this.fb.group({
      sponsorshipType: ['', Validators.required],
      pocName: ['', [Validators.required, Validators.pattern(namePattern)]],
      pocEmail: ['', [Validators.required, Validators.email]],
      state: ['', Validators.required],
      address: ['', Validators.required],
      peacekeeper: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(namePattern)]],
      refPeacekeeper: [''],
      sponsorshipName: ['', [Validators.required, Validators.pattern(namePattern)]],
      pocMobile: ['', [Validators.required, Validators.pattern(mobilePattern)]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      refBy: ['']
    });
  }

  setupConditionalValidation() {
    this.form.get('refBy')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      const refPeacekeeperControl = this.form.get('refPeacekeeper');
      const nameControl = this.form.get('name');

      // Reset controls when refBy changes
      refPeacekeeperControl?.reset();
      nameControl?.reset();

      // Update validators based on selection
      if (value === 'peacekeeper') {
        refPeacekeeperControl?.setValidators(Validators.required);
        nameControl?.clearValidators();
      } else if (value === 'other') {
        nameControl?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]);
        refPeacekeeperControl?.clearValidators();
      } else {
        refPeacekeeperControl?.clearValidators();
        nameControl?.clearValidators();
      }

      refPeacekeeperControl?.updateValueAndValidity();
      nameControl?.updateValueAndValidity();
    });
  }

  onSubmit():void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
      // Handle form submission
    } else {
      this.form.markAllAsTouched();
    }
  }
}
