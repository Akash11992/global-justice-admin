import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';
import { strictStringValidator } from '../../validator/strict-string-validator';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-sponsorship',
  templateUrl: './add-sponsorship.component.html',
  styleUrls: ['./add-sponsorship.component.css']
})
export class AddSponsorshipComponent implements OnInit{

  form: FormGroup;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  peacekeepers: any[] = [];
  sponsorshipTypes: any[] = [];
  // refByOptions = ['peacekeeper', 'other'];
  refByOptions = ['peacekeeper'];
  private destroy$ = new Subject<void>();
  sponsorshipId!: string;
  selectedCountryObj:any ={};
  selectedStateObj:any ={};
  selectedCityObj:any ={};
  selectedSTypeObj:any ={};

  selectedPeacekeeperObj:any ={};
  selectedRefObj:string ='';
  spononsershipResData:any;
  title:string = "Add";
  
  constructor(
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService,
              private ngxService: NgxUiLoaderService,
              private SharedService: SharedService,
              private location: Location

            ) {
    
  }

  ngOnInit() {
    this.initializeForm();
    this.setSponorshipType();
    if(!this.sponsorshipId){
      this.selectedCountryObj={id:"",name:""};
      this.selectedStateObj={id:"",name:""};
      this.selectedCityObj={id:"",name:""};

      this.setupCountry();
      this.setupConditionalValidation();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm() {
    this.sponsorshipId = this.route.snapshot.paramMap.get('id');
    if(this.sponsorshipId){
      this.loadSponsorshipDataById();
    }

    const namePattern = /^[a-zA-Z0-9 -]{1,50}$/;
    const mobilePattern = /^\+[1-9]\d{9,14}$/;
    const addressPattern = /^[a-zA-Z0-9\s,.'\-/#]{1,100}$/;
    const emailPattern = /^[A-Za-z0-9]+([._%+-]*[A-Za-z0-9]+)*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;


    this.form = this.fb.group({
      sponsorshipType: ['', Validators.required],
      pocName: ['', [Validators.required, Validators.pattern(namePattern), strictStringValidator()]],
      pocEmail: ['', [Validators.pattern(emailPattern),Validators.maxLength(254)]],
      state: ['0'],
      address: ['', [Validators.pattern(addressPattern), strictStringValidator()]],
      sponsorshipName: ['', [Validators.required,strictStringValidator()]],
      pocMobile: ['', [Validators.pattern(mobilePattern)]],
      country: ['0'],
      city: ['0'],

      refBy: [''],
      name: [''],
      refPeacekeeper: ['']
    });

  }

  setupConditionalValidation() {
    this.form.get('refBy')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.updateValidation(value);
    });
  }

  setSponorshipType(): void{
    this.adminService.listSponosorshipType().subscribe((data: any) => {
      this.sponsorshipTypes = data['data'];
    },
    (error: any) => {
      console.log(error);
    }
    )
  }

  setupCountry(): void{
    this.adminService.listCountry().subscribe((data: any) => {
      this.countries = data['data'];
      if(this.sponsorshipId){
        const patchFormData = {
          country: +this.spononsershipResData['country_id'],
        }
        this.form.patchValue(patchFormData);
      }
    },
    (error: any) => {
      console.log(error);
    }
    )
  }

  onSponsorshipTypeChange(event: Event): void{

    const selectedElement = event.target as HTMLSelectElement;
    const selectedName = selectedElement.selectedOptions[0].dataset.name;

    this.selectedSTypeObj = {
      id:selectedElement.value,
      name:selectedName,
    };
  }


  onCountryChange(event: Event): void{

    const selectedElement = event.target as HTMLSelectElement;
    const selectedName = selectedElement.selectedOptions[0].dataset.name;

    this.selectedCountryObj = {
      id:selectedElement.value,
      name:selectedName,
    };

    this.states = [];
    this.cities = [];

    this.selectedStateObj={id:"",name:""};
    this.selectedCityObj={id:"",name:""};
    this.form.controls['state'].setValue(0);
    this.form.controls['city'].setValue(0);

    this.callStateByIdApi(selectedElement.value, "ON_CHANGE");
  }

  callStateByIdApi(selectedId:any, from:string){
    this.adminService.getStateById(selectedId).subscribe((data: any) => {
      this.states = data['data'];
      if(this.sponsorshipId && from == "ON_LOAD"){
        const patchFormData = {
          state: +this.spononsershipResData['state_id'],
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
    this.form.controls['city'].setValue(0);

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

  onPeacekeeperChange(event: Event): void{
    const selectedElement = event.target as HTMLSelectElement;
    const selectedName = selectedElement.selectedOptions[0].dataset.name;

    this.selectedPeacekeeperObj = {
      id:selectedElement.value,
      name:selectedName,
    }

  }

  onChangeReferBy(event: Event): void{
    const selectedElement = event.target as HTMLSelectElement;
    this.selectedRefObj = selectedElement.value;

    if(this.sponsorshipId && selectedElement.value == 'peacekeeper'){
      this.setupPeacekeeper("default");
    }
  }

  callCityByIdApi(selectedId:any, from:string){
    this.adminService.getCityById(selectedId).subscribe((data: any) => {
      this.cities = data['data'];
      if(this.sponsorshipId && from == "ON_LOAD"){
        const patchFormData = {
          city: +this.spononsershipResData['city_id'],
        }
        this.form.patchValue(patchFormData);
      }
    },
    (error: any) => {
      console.log(error);
    }
    )
  }

  setupPeacekeeper(action?:any): void{
      this.adminService.listPeaceKeeper().subscribe((data: any) => {
        this.peacekeepers = data['data'];
        if(this.sponsorshipId && action != "default"){
          const patchFormData = {
            refPeacekeeper:this.spononsershipResData["ref_by"] === 'peacekeeper' ? +this.spononsershipResData['peacekeeper_id'] : "",
          }
          this.form.patchValue(patchFormData);
        }
      },
      (error: any) => {
        console.log(error);
      }
      )
  }

  loadSponsorshipDataById(){
    this.title = "Edit";
    this.ngxService.start();
    this.adminService.getSponsorship(this.sponsorshipId).subscribe((data: any) => {
      this.ngxService.stop();

      this.spononsershipResData = data;

      this.setupCountry();
      if(data['country_id'] !=0) this.callStateByIdApi(data['country_id'], "ON_LOAD");
      if(data['state_id'] !=0) this.callCityByIdApi(data['state_id'], "ON_LOAD");

      const patchFormData = {
        sponsorshipType: data['sponsorship_type_id'],
        pocName: data['poc_name'],
        pocEmail: data['poc_email'],
        city: data['city_id'],
        state: data['state_id'],

        address: data['address'],
        name: data["ref_by"] === 'other' ? data["peacekeeper_other_name"] : "",
        sponsorshipName: data['sponsorship_name'],
        pocMobile: data['poc_mobile'],
        refBy: data['ref_by'],
      }
      this.form.patchValue(patchFormData);
      this.updateValidation(data['ref_by']);

    },
    (error: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('Oops failed to update sponsor', 'Sponsor', 'error');

    }
    )
  }

  updateValidation(refBy: string) {
    const peacekeeperSelect = this.form.get('refPeacekeeper');
    const otherName = this.form.get('name');

    const namePattern = /^[a-zA-Z0-9' ]{1,50}$/;

    if (refBy === 'peacekeeper') {
      peacekeeperSelect?.setValidators([Validators.required]);
      otherName?.clearValidators();
      this.setupPeacekeeper();
    } else if (refBy === 'other') {
      otherName?.setValidators([Validators.required,Validators.pattern(namePattern),strictStringValidator()]);
      peacekeeperSelect?.clearValidators();
    } else {
      peacekeeperSelect?.clearValidators();
      otherName?.clearValidators();
    }

    // Update validity
    peacekeeperSelect?.updateValueAndValidity();
    otherName?.updateValueAndValidity();
  }

  onSubmit():void {
    console.log(this.form);
    if (this.form.valid) {
      console.log("payload", this.form.value);

      const payload = {
        sponsorship_type_id:this.form.value["sponsorshipType"],
        sponsorship_type:this.selectedSTypeObj["name"] ? this.selectedSTypeObj["name"] : this.spononsershipResData['sponsorship_type'],

        sponsorship_name:this.form.value["sponsorshipName"],
        poc_name:this.form.value["pocName"],
        poc_mobile:this.form.value["pocMobile"],
        poc_email:this.form.value["pocEmail"],
        country_id:+this.form.value["country"],
        country: "name" in this.selectedCountryObj ? this.selectedCountryObj["name"]:this.spononsershipResData['country'],
        state_id:+this.form.value["state"],
        state: "name" in this.selectedStateObj ? this.selectedStateObj["name"]:this.spononsershipResData['state'],
        city_id:+this.form.value["city"],
        city:"name" in this.selectedCityObj ? this.selectedCityObj["name"]:this.spononsershipResData['city'],

        address:this.form.value["address"],
        ref_by:this.form.value["refBy"] ? this.form.value["refBy"] : '',
        is_active: this.sponsorshipId ? this.spononsershipResData['is_active'] : 1,
        peacekeeper_id:this.form.value["refBy"] === 'peacekeeper' ? +this.form.value["refPeacekeeper"] : null,
        peacekeeper_other_name:this.form.value["refBy"] === 'peacekeeper' ? 
        this.selectedPeacekeeperObj?.name ?this.selectedPeacekeeperObj["name"]:this.spononsershipResData['peacekeeper_other_name'] : this.form.value["name"]

      };

      this.ngxService.start();
      if(this.sponsorshipId){
        this.adminService.updateSponsorship(this.sponsorshipId,payload).subscribe((data: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('Sponsor updated successfully', 'Sponsor', 'success');
        },
        (error: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('Oops failed to updated sponsor', 'Sponsor', 'error');

        }
        )
      }else{
        this.adminService.createSponsership(payload).subscribe((data: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('Sponsor added successfully', 'Sponsor', 'success');

          this.resetForm();
        },
        (error: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('Oops failed to add sponsor', 'Sponsor', 'error');

        }
        )
      }
      

    } else {
      this.form.markAllAsTouched();
    }
  }

  resetForm() :void{
    this.form.reset({
      sponsorshipType: "",
      pocName: "",
      pocEmail: "",
      state: "",
      address: "",
      name: "",
      refPeacekeeper: "",
      sponsorshipName: "",
      pocMobile: "",
      country: "",
      city: "",
      refBy: ""
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onCancel(): void {
    // this.router.navigate(['/dashboard/sponsor']); 
    this.location.back(); 

  }
}
