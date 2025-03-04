import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';
import { strictEmailValidator } from '../../validator/email-validator';
import { environment } from 'src/environments/environment';
import { strictStringValidator } from '../../validator/strict-string-validator';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-collaborator',
  templateUrl: './add-collaborator.component.html',
  styleUrls: ['./add-collaborator.component.css']
})
export class AddCollaboratorComponent {

  form: FormGroup;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  selectedCountryObj:any={};
  selectedStateObj:any ={};
  selectedCityObj:any ={};
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
                private SharedService: SharedService,
                private location: Location
              ) {}

    ngOnInit() {
      this.initializeForm();
      this.setupPeacekeeper();
      if(!this.collaboratorId){
        this.selectedStateObj={id:"",name:""};
        this.selectedCityObj={id:"",name:""};
        this.setupCountry();
      }
    }

    initializeForm() {
      this.collaboratorId = this.route.snapshot.paramMap.get('id');

      if(this.collaboratorId) this.collaboratorDataById();
      
      const namePattern = /^[a-zA-Z0-9' -]{1,50}$/;
      const mobilePattern = /^\+[1-9]\d{9,14}$/;
      const addressPattern = /^[a-zA-Z0-9\s,.'\-/#]{1,100}$/;
    
      this.form = this.fb.group({
        email: ['', [Validators.required, strictEmailValidator(), Validators.maxLength(254)]],
        fullName: ['', [Validators.required, Validators.pattern(namePattern), strictStringValidator()]],
        mobile: ['', [Validators.required,Validators.pattern(mobilePattern)]],
        country: ['0', Validators.required],
        state: ['0'],
        address: ['', [Validators.pattern(addressPattern), strictStringValidator()]],
        city: ['0'],
        dob: ['02-02-1996'],
        logoImage: ['',Validators.required],
        refPeacekeeper: ['',Validators.required]
      });

      if(this.collaboratorId){
        this.form.controls['email'].disable();
        this.form.controls['mobile'].disable();
        this.form.controls['country'].disable(); 
        this.form.controls['state'].disable(); 
        this.form.controls['city'].disable(); 
        this.form.controls['address'].disable(); 
        this.form.controls['refPeacekeeper'].disable(); 
      }

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
        code:selectedCode
      };
      
      this.states = [];
      this.cities = [];
      this.selectedStateObj={id:"",name:""};
      this.selectedCityObj={id:"",name:""};
      this.form.controls['state'].setValue('0');
      this.form.controls['city'].setValue('0');
      this.callStateByIdApi(selectedElement.value, "ON_CHANGE");
    }

    callStateByIdApi(selectedId:any, from:string){
      this.adminService.getStateById(selectedId).subscribe((data: any) => {
        this.states = data['data'];
        if(this.collaboratorId && from == "ON_LOAD"){
          const patchFormData = {
            state: +this.collaboratorResData['state_id'],
          }
          this.form.patchValue(patchFormData);
        }
  
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
      };
  
      this.cities = [];
      this.selectedCityObj={id:"",name:""};
      this.form.controls['city'].setValue('0');
      this.callCityByIdApi(selectedElement.value, "ON_CHANGE");
    }
  
    onCityChange(event: Event): void{
      const selectedElement = event.target as HTMLSelectElement;
      const selectedId = selectedElement.selectedOptions[0].dataset.name;
  
      this.selectedCityObj = {
        id:selectedElement.value,
        name:selectedId,
      }
  
    }

    callCityByIdApi(selectedId:any, from:string){
      this.adminService.getCityById(selectedId).subscribe((data: any) => {
        this.cities = data['data'];
        if(this.collaboratorId && from == "ON_LOAD"){
          const patchFormData = {
            city: +this.collaboratorResData['city_id'],
          }
          this.form.patchValue(patchFormData);
        }
      },
      (error: any) => {
        console.log(error);
      }
      )
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
          mobile_no:this.collaboratorId ? this.collaboratorResData['mobile_no']:this.form.value["mobile"],
          email:this.collaboratorId ? this.collaboratorResData['email']: this.form.value["email"],
          country_id:this.collaboratorId ? this.collaboratorResData['country_id']:+this.form.value["country"],
          country:this.selectedCountryObj["name"]?this.selectedCountryObj["name"]:this.collaboratorResData['country'],
          country_code:this.selectedCountryObj["code"]?this.selectedCountryObj["code"]:this.collaboratorResData['country_code'],
          state_id:+this.form.value["state"],
          state:"name" in this.selectedStateObj ?this.selectedStateObj["name"]:this.collaboratorResData['state'],
          city_id:+this.form.value["city"],
          city:"name" in this.selectedCityObj ?this.selectedCityObj["name"]:this.collaboratorResData['city'],
          address:this.form.value["address"],
          dob:this.collaboratorId ? this.collaboratorResData['dob'] : this.form.value["dob"],
          logo_image: this.form.value['logoImage'],
          is_active: this.collaboratorId ? this.collaboratorResData['is_active'] : 1,
          peacekeeper_id:this.collaboratorId ? this.collaboratorResData['peacekeeper_id'] : this.form.value["refPeacekeeper"],
          peacekeeper_ref_code:this.selectedPeacekeeperObj['couponCode'] ? this.selectedPeacekeeperObj["couponCode"]: this.collaboratorResData['peacekeeper_ref_code'],
          domain_url:environment.domainUrl,
          is_updated_by_activated: 0
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
      // this.router.navigate(['/dashboard/collaborator']);  
      this.location.back();
    }

    noFutureDateValidator(control: any) {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      return selectedDate > today ? { futureDate: true } : null;
    }
  
}
