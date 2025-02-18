import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';
import { strictEmailValidator } from '../../validator/email-validator';

@Component({
  selector: 'app-add-collaborator',
  templateUrl: './add-collaborator.component.html',
  styleUrls: ['./add-collaborator.component.css']
})
export class AddCollaboratorComponent {

  form: FormGroup;
  countries: any[] = [];
  selectedCountryObj:any={};
  selectedPeacekeeperObj:any ={};

  peacekeepers: any[] = [];
  collaboratorId!: string;
  collaboratorResData:any;
  selectedImageBase64: string | null = null;
  maxDate: string = new Date().toISOString().split('T')[0];
  fileError: string | null = null;
  maxSize = 5 * 1024 * 1024; // 5MB in bytes
  allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
  title:string = "Add";

  @ViewChild('fileInput') fileInput!: ElementRef;

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
      this.setupPeacekeeper();
      if(!this.collaboratorId){
        this.setupCountry();
      }
    }

    initializeForm() {
      this.collaboratorId = this.route.snapshot.paramMap.get('id');
      if(this.collaboratorId){
        this.collaboratorDataById();
      }
      const namePattern = /^[a-zA-Z0-9' ]{1,50}$/;
      const mobilePattern = /^\+?[1-9]\d{9,14}$/;
    
        this.form = this.fb.group({
          email: ['', [Validators.required, strictEmailValidator(), Validators.maxLength(254)]],
          fullName: ['', [Validators.required, Validators.pattern(namePattern)]],
          mobile: ['', [Validators.required,Validators.pattern(mobilePattern)]],
          country: ['', Validators.required],
          dob: ['',[Validators.required,this.noFutureDateValidator]],
          logoImage: ['',Validators.required],
          refPeacekeeper: ['',Validators.required]
        });
      }

      collaboratorDataById(){
        this.title = "Edit";
        this.ngxService.start();
        this.adminService.getCollaborator(this.collaboratorId).subscribe((data: any) => {
          this.ngxService.stop();
          this.collaboratorResData = data;
    
          this.setupCountry();
    
          const patchFormData = {
            email: data['email'],
            fullName: data['full_name'],
            mobile: data['mobile_no'],
            dob: data['dob'],
            logoImage: data['logo_image'],
            refPeacekeeper:+data['peacekeeper_id']
          }

          this.selectedImageBase64 = data['logo_image'];
          this.form.patchValue(patchFormData);
    
        },
        (error: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('Oops failed to update collaborator', 'Collaborator', 'error');
        }
        )
      }

    setupPeacekeeper(): void{
        this.adminService.listPeaceKeeper().subscribe((data: any) => {
          this.peacekeepers = data['data'];
          if(this.collaboratorId){
            const patchFormData = {
              refPeacekeeper:+this.collaboratorResData['peacekeeper_id']
            }
            this.form.patchValue(patchFormData);
          }
        },
        (error: any) => {
          console.log(error);
        }
        )
    }

    onPeacekeeperChange(event: Event): void{
      const selectedElement = event.target as HTMLSelectElement;
      const selectedCouponCode = selectedElement.selectedOptions[0].dataset.couponcode;
  
      this.selectedPeacekeeperObj = {
        id:selectedElement.value,
        couponCode:selectedCouponCode,
      }
  
    }
  

    setupCountry(): void{
      this.adminService.listCountry().subscribe((data: any) => {
        this.countries = data['data'];
        if(this.collaboratorId){
          const patchFormData = {
            country: +this.collaboratorResData['country_id'],
          }
          this.form.patchValue(patchFormData);
        }
      },
      (error: any) => {
        console.log(error);
      }
      )
    }
  
    onCountryChange(event: Event): void{
  
      const selectedElement = event.target as HTMLSelectElement;
      const selectedName = selectedElement.selectedOptions[0].dataset.name;
      const selectedCode = selectedElement.selectedOptions[0].dataset.code;
  
      this.selectedCountryObj = {
        id:selectedElement.value,
        name:selectedName,
        code:selectedCode,
      };
  
    }

    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (!file) {
        this.fileError = "Please select an image.";
        return;
      }
  
      if (!this.allowedTypes.includes(file.type)) {
        this.fileError = "Only JPG, PNG, and SVG files are allowed.";
        return;
      }
  
      if (file.size > this.maxSize) {
        this.fileError = "File size must be less than 5MB.";
        return;
      }

      if (file) {
        this.SharedService.convertToBase64(file).then((base64) => {
          this.fileError = null;
          this.selectedImageBase64 = base64;
          this.form.patchValue({ logoImage: this.selectedImageBase64 });
        });
      }
    }

    onSubmit():void {
      console.log(this.form);
      if (this.form.valid) {
        console.log("payload", this.form.value);
  
        const payload = {
          full_name:this.form.value["fullName"],
          mobile_no:this.form.value["mobile"],
          email:this.form.value["email"],
          country_id:this.form.value["country"],
          country:this.selectedCountryObj["name"]?this.selectedCountryObj["name"]:this.collaboratorResData['country'],
          country_code:this.selectedCountryObj["code"]?this.selectedCountryObj["code"]:this.collaboratorResData['country_code'],
          dob:this.form.value["dob"],
          logo_image: this.form.value['logoImage'],
          is_active: this.collaboratorId ? this.collaboratorResData['is_active'] : 0,
          peacekeeper_id:this.form.value["refPeacekeeper"],
          peacekeeper_ref_code:this.selectedPeacekeeperObj['couponCode'] ? this.selectedPeacekeeperObj["couponCode"]: this.collaboratorResData['peacekeeper_ref_code'],
          domain_url:'https://globaljusticeuatadmin.cylsys.com'
        };
  
        this.ngxService.start();
        if(!this.collaboratorId){
          this.adminService.createCollaborator(payload).subscribe((data: any) => {
            this.ngxService.stop();
            this.SharedService.ToastPopup('Collaborator added successfully', 'Collaborator', 'success');
            this.resetForm();
          },
          (error: any) => {
            this.ngxService.stop();
            this.SharedService.ToastPopup('Oops failed to add collaborator', 'Collaborator', 'error');
          }
          )
        }else{
          this.adminService.updateCollaborator(this.collaboratorId,payload).subscribe((data: any) => {
            this.ngxService.stop();
            this.SharedService.ToastPopup('Collaborator updated successfully', 'Collaborator', 'success');
          },
          (error: any) => {
            this.ngxService.stop();
            this.SharedService.ToastPopup('Oops failed to update collaborator', 'Collaborator', 'error');
          }
          )
        }
        
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
        dob: "",
        refPeacekeeper:""
      });
      this.selectedImageBase64 = null;
      this.fileInput.nativeElement.value = "";
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  
    onCancel(): void {
      this.router.navigate(['/dashboard/collaborator']);  
    }

    noFutureDateValidator(control: any) {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      return selectedDate > today ? { futureDate: true } : null;
    }
  
}
