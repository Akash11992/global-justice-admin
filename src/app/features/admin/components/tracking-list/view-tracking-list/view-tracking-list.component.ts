import { AdminService } from 'src/app/features/admin/services/admin.service';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName, FormBuilder, FormArray,AbstractControl  } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'app-view-tracking-list',
  templateUrl: './view-tracking-list.component.html',
  styleUrls: ['./view-tracking-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewTrackingListComponent {
  trackingListdata:any;
  selectedUserIds: number[] = [];
  notFound: boolean = false;
  searchForm:any= FormGroup;
  selectAll: boolean = false;
  qrCodeSrc: any; // Define a property to hold the QR code source
  constructor( private cd: ChangeDetectorRef,private fb: FormBuilder, private AdminService: AdminService,private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router,private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,)
   
  {
    
  }

  ngOnInit(): void {
    this.GetAlltrackingListdata();
    
    this.createForm();
  }
  createForm(){
    this.searchForm = this.fb.group({
      searchInput: [''] // Initialize with an empty string
    });
  }

  GetAlltrackingListdata() {
    // this.ngxService.start();
    this.AdminService.getAllTracking().subscribe((data: any) => {
      console.log("data", data.data);
      if (data && data.data !== undefined) {
        this.trackingListdata = data.data;
        console.log(this.trackingListdata);
        // for (let i of this.trackingListdata) {
        //   this.qrCodeSrc = this.bufferToDataURL(i.qr_code.data);
        // }
      } else {
        this.notFound = true;
      }
        // Manually trigger change detection to update the view
  this.cd.detectChanges();
    },(err) => {
      console.error('tracking link data operation failed:', err);
    })
    
  }

  // Function to convert buffer data to data URL
  bufferToDataURL(bufferData: number[]): string {
    // Convert the buffer data to a Uint8Array
    const uint8Array = new Uint8Array(bufferData);
    
    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array]);
    
    // Create a data URL from the Blob
    const dataURL = URL.createObjectURL(blob);
    
    return dataURL;
  }


 
 // Function to update selectedUserIds array when a row is clicked
 updateSelectedData(userId: any) {
  // Check if the user ID is already selected, and toggle selection
  console.log(userId);
  
  // Convert userId to a number
  const id = Number(userId);
 

  if (this.selectedUserIds.includes(id)) {
    this.selectedUserIds = this.selectedUserIds.filter(selectedId => selectedId !== id);
  } else {
    this.selectedUserIds.push(id);
  }

  console.log('selectedUserIds:', this.selectedUserIds);

}

DeleteSelected(): void {
  if (this.selectedUserIds.length === 0) {
    // Handle the case when no users are selected.
    this.SharedService.ToastPopup('',"please select record!" , 'error')

    return;
  }
  
  // Prepare the payload with selected user IDs and status 0.
  const payload = {
    tracking_link_id: this.selectedUserIds.join(','), // Convert array to comma-separated string
  };
  console.log("payload", payload);
  this.ngxService.start();
  this.AdminService.DeleteTracking(payload).subscribe((data: any) => {
    this.ngxService.stop();
    this.SharedService.ToastPopup('', data.message, 'success')
    // this.GetAlltrackingListdata();
    window.location.reload();
  });
}
toggleSelectAll() {
  // Toggle the selectAll variable
  this.selectAll = !this.selectAll;

  // If selectAll is true, add all user_ids to the selectedUserIds array
  console.log(this.selectAll);

  if (this.selectAll) {
    // this.selectedUserIds = this.nonregist.map(user => user.user_id.toString());
    this.selectedUserIds = this.trackingListdata.map((user:any) => user.tracking_link_id);
    console.log(this.selectedUserIds);

  } else {
    // If selectAll is false, clear the AllselectedUserIds array
    this.selectedUserIds = [];
  }
}
DeletedDropdown(tracking_link_id: number): void {
  // Update the selected users
  this.updateSelectedData(tracking_link_id);

  // Now, call the unapproveSelected function
  this.DeleteSelected();
}


resetForm(): void {
  this.searchForm.reset();
  this.GetAlltrackingListdata();

}
search(): void {
  const searchValue = this.searchForm.get('searchInput').value;
  console.log("search called", searchValue);
  if ( searchValue===null ||searchValue.trim() === '' ) {
    // Display an error toaster here
    this.SharedService.ToastPopup('',"Search value cannot be empty", 'error')
    return; // Exit the function
  }
  const payload = {
    search: searchValue
  };
  console.log("payload", payload);
  this.ngxService.start();
  this.AdminService.SearchTracking(payload).subscribe((data: any) => {
    this.ngxService.stop();  
    this.trackingListdata= data.data[0]
    if(this.trackingListdata.length===0){
      this.notFound=true;
    } else{
      this.notFound = false;
      this.trackingListdata= data.data[0];
          this.SharedService.ToastPopup('', 'data fetched successfully', 'success')

      console.log("false");
    }
// Manually trigger change detection to update the view
this.cd.detectChanges();
  })
}
}

