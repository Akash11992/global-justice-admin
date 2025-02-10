import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName, FormBuilder, FormArray,AbstractControl  } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router,ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/features/admin/services/admin.service';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';
@Component({
  selector: 'app-add-tracking-list',
  templateUrl: './add-tracking-list.component.html',
  styleUrls: ['./add-tracking-list.component.css']
})
export class AddTrackingListComponent {
  form:any= FormGroup;
  formsdata:any;
  submitted = false; // Add a boolean to track form submission


  constructor( private fb: FormBuilder, private AdminService: AdminService,private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router,private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,)
   
  {
    
  }
  ngOnInit(): void {
    this.allRefrence();

    this.createForm();
 
    
  }
  allRefrence() {
    // this.ngxService.start();
    this.AdminService.getAllFormsEndpoint().subscribe((data: any) => {
      console.log("data",data.data);
      this.formsdata= data.data
    });
  }
  createForm(){
    this.form = this.fb.group({
      // trackingParameter: [
      //   '',
      //   [Validators.required, this.trackingValidator], // Synchronous and asynchronous validators
      // ],
      selectform: ['', Validators.required],
      reference: ['', Validators.required], // Add required validator
      tracking_key:[''],
      tracking_url:['']
    });
  }
  updateTrackingKey() {
    // Get the value of the 'Reference' input field
    const referenceValue = this.form.get('reference').value;

    // Convert the reference value to lowercase and replace spaces with underscores
    const trackingKey = referenceValue.toLowerCase().replace(/ /g, '_');

    // Set the tracking key in the form control
    this.form.get('tracking_key').setValue(trackingKey);
    // After setting the tracking_key, call updateTrackingURL to update tracking_url
  this.updateTrackingURL();
}

updateTrackingURL() {
  const selectedFormId = this.form.get('selectform').value;

  console.log("selectedFormId", selectedFormId);
  
  // console.log("Form IDs in formsdata:", this.formsdata.map((form:any) => form.form_id));
  // Filter the formsdata array based on the selected form_id
  const filteredFormData = this.formsdata.filter((form: any) => form.form_id == selectedFormId);

  console.log("filteredFormData", filteredFormData);

  if (filteredFormData.length > 0) {
      const selectedFormData = filteredFormData[0];
        // Append ?tracking_key=<value> to the form_url
        const trackingKey = this.form.get('tracking_key').value; // Get the tracking_key value
        console.log(trackingKey);
        
        const modifiedFormUrl = selectedFormData.form_url + `?ref=${trackingKey}`;

        this.form.get('tracking_url').setValue(modifiedFormUrl);
      // this.form.get('tracking_url').setValue(selectedFormData.form_url);
  } else {
      // Handle the case where no matching form is found
      this.form.get('tracking_url').setValue('');
  }
}



  submitForm() {
    this.submitted = true; 
    if (this.form.valid) {
      console.log("valid form");
      
      let payload={
        
  "form_id": this.form.get('selectform').value,
  "refrence": this.form.get('reference').value,
  "tracking_key": this.form.get('tracking_key').value,
  "tracking_url": this.form.get('tracking_url').value,
  "tiny_url": "",
  "created_by": "admin"
      }
      console.log(payload);
      
     
        // this.ngxService.start();
        this.AdminService.TrackingLink(payload).subscribe((res: any) => {
          console.log("data",res);
          this.SharedService.ToastPopup('',res.message,'success')
          this.router.navigateByUrl('/dashboard/tracking-link');

        }, (err:any) => {
          console.log("Err",err, err.message);
          this.SharedService.ToastPopup('','This details already exist!','error')
        //  this.ngxService.stop();
        });
        
      
      // Form is valid, handle the submission logic here
    } else {
      // Form is not valid, mark all fields as touched to display validation errors
      this.form.markAllAsTouched();
      console.log("invalid form");
      
    }
  }
  trackingValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    // Check if the value starts with "ref="
    if (value && !value.startsWith('ref=')) {
      return { invalidReference: true };
    }
    return null;
  }
}
