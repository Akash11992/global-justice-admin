import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';

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
  sponsorshipTypes = ['patron', 'partner'];
  refByOptions = ['peacekeeper', 'other'];
  private destroy$ = new Subject<void>();
  sponsorshipId!: string;
  selectedCountryObj:any={};
  selectedStateObj:any ={};
  selectedCityObj:any ={};
  selectedPeacekeeperObj:any ={};
  spononsershipResData:any;
  
  constructor(
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService,
              private ngxService: NgxUiLoaderService,
              private SharedService: SharedService
            ) {
    
  }

  ngOnInit() {
    this.initializeForm();
    if(!this.sponsorshipId){
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

    const namePattern = /^[a-zA-Z ]+$/;

    this.form = this.fb.group({
      sponsorshipType: ['', Validators.required],
      pocName: ['', [Validators.required, Validators.pattern(namePattern)]],
      pocEmail: ['', [Validators.required, Validators.email]],
      state: ['', Validators.required],
      address: ['', Validators.required],
      sponsorshipName: ['', [Validators.required, Validators.pattern(namePattern)]],
      pocMobile: ['', [Validators.required]],
      country: ['', Validators.required],
      city: ['', Validators.required],
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

  onCountryChange(event: Event): void{

    const selectedElement = event.target as HTMLSelectElement;
    const selectedName = selectedElement.selectedOptions[0].dataset.name;

    this.selectedCountryObj = {
      id:selectedElement.value,
      name:selectedName,
    };

    this.callStateByIdApi(selectedElement.value);
  }

  callStateByIdApi(selectedId:any){
    this.adminService.getStateById(selectedId).subscribe((data: any) => {
      this.states = data['data'];
      if(this.sponsorshipId){
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
    }

    this.callCityByIdApi(selectedElement.value);
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

  callCityByIdApi(selectedId:any){
    this.adminService.getCityById(selectedId).subscribe((data: any) => {
      this.cities = data['data'];
      if(this.sponsorshipId){
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

  setupPeacekeeper(): void{
      this.adminService.listPeaceKeeper().subscribe((data: any) => {
        this.peacekeepers = data['data'];
        if(this.sponsorshipId){
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
    this.adminService.getSponsorship(this.sponsorshipId).subscribe((data: any) => {
      this.ngxService.stop();

      this.spononsershipResData = data;

      this.setupCountry();
      this.callStateByIdApi(data['country_id']);
      this.callCityByIdApi(data['state_id']);
      data["ref_by"] === 'other'?'':this.setupPeacekeeper();

      const patchFormData = {
        sponsorshipType: data['sponsorship_type'],
        pocName: data['poc_name'],
        pocEmail: data['poc_email'],
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
      this.SharedService.ToastPopup('Oops failed to update sponsorship', 'Badge', 'error');
    }
    )
  }

  updateValidation(refBy: string) {
    const peacekeeperSelect = this.form.get('refPeacekeeper');
    const otherName = this.form.get('name');

    if (refBy === 'peacekeeper') {
      peacekeeperSelect?.setValidators([Validators.required]);
      otherName?.clearValidators();
      this.setupPeacekeeper();
    } else if (refBy === 'other') {
      otherName?.setValidators([Validators.required]);
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
        sponsorship_type:this.form.value["sponsorshipType"],
        sponsorship_name:this.form.value["sponsorshipName"],
        poc_name:this.form.value["pocName"],
        poc_mobile:this.form.value["pocMobile"],
        poc_email:this.form.value["pocEmail"],
        country_id:this.form.value["country"],
        country:this.selectedCountryObj["name"]?this.selectedCountryObj["name"]:this.spononsershipResData['country'],
        state_id:this.form.value["state"],
        state:this.selectedStateObj["name"]?this.selectedStateObj["name"]:this.spononsershipResData['state'],
        city_id:this.form.value["city"],
        city:this.selectedCityObj["name"]?this.selectedCityObj["name"]:this.spononsershipResData['city'],
        address:this.form.value["address"],
        ref_by:this.form.value["refBy"],
        peacekeeper_id:this.form.value["refBy"] === 'peacekeeper' ? this.form.value["refPeacekeeper"] : null,
        peacekeeper_other_name:this.form.value["refBy"] === 'peacekeeper' ? 
        this.selectedPeacekeeperObj['name'] ?this.selectedPeacekeeperObj["name"]:this.spononsershipResData['peacekeeper_other_name'] : this.form.value["name"]
        
      };

      this.ngxService.start();
      if(this.sponsorshipId){
        this.adminService.updateSponsorship(this.sponsorshipId,payload).subscribe((data: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('sponsorship updated successfully', 'Badge', 'success');
          this.resetForm();
        },
        (error: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('Oops failed to updated sponsorship', 'Badge', 'error');
        }
        )
      }else{
        this.adminService.createSponsership(payload).subscribe((data: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('sponsorship added successfully', 'Badge', 'success');
          this.resetForm();
        },
        (error: any) => {
          this.ngxService.stop();
          this.SharedService.ToastPopup('Oops failed to add sponsorship', 'Badge', 'error');
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
    this.router.navigate(['/dashboard/sponsorship']);  
  }
}
