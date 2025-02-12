import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-add-collaborator',
  templateUrl: './add-collaborator.component.html',
  styleUrls: ['./add-collaborator.component.css']
})
export class AddCollaboratorComponent {

  form: FormGroup;
  countries: any[] = [];
  selectedCountryObj:any={};

  constructor(
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private adminService: AdminService,
                private ngxService: NgxUiLoaderService,
                private SharedService: SharedService
              ) {}

    ngOnInit() {
      this.initializeForm();
      this.setupCountry();
    }

    initializeForm() {
        const namePattern = /^[a-zA-Z ]+$/;
    
        this.form = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          fullName: ['', [Validators.required, Validators.pattern(namePattern)]],
          mobile: ['', [Validators.required]],
          country: ['', Validators.required],
          refBy: ['']
        });
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
  
    onCountryChange(event: Event): void{
  
      const selectedElement = event.target as HTMLSelectElement;
      const selectedName = selectedElement.selectedOptions[0].dataset.name;
  
      this.selectedCountryObj = {
        id:selectedElement.value,
        name:selectedName,
      };
  
    }

    onSubmit():void {
      console.log(this.form);
      if (this.form.valid) {
        console.log("payload", this.form.value);
  
        const payload = {
          full_name:this.form.value["fullName"],
          mobile:this.form.value["mobile"],
          email:this.form.value["email"],
          country_id:this.form.value["country"],
          country:this.selectedCountryObj["name"],
          dob:this.form.value["dob"]
        };
  
        this.ngxService.start();
        
        this.adminService.createCollaborator(payload).subscribe((data: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('collaborator added successfully', 'Badge', 'success');
        },
        (error: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('Oops failed to add collaborator', 'Badge', 'error');
        }
        )
        
      } else {
        this.form.markAllAsTouched();
      }
    }
  
    resetForm() {
      this.form.reset({
        fullName: "",
        email: "",
        mobile: "",
        country: "",
        dob: ""
      });
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  
    onCancel(): void {
      this.router.navigate(['/dashboard/collaborator']);  
    }
  
}
