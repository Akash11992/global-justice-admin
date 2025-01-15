import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName, FormBuilder, FormArray, } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router,ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ExportToCsv } from 'export-to-csv';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-registered-user',
  templateUrl: './registered-user.component.html',
  styleUrls: ['./registered-user.component.css']
})

export class RegisteredUserComponent {
  form_name:any;
  notFound:boolean=false;
  activeTab: string = 'delegate'; // Default active tab is 'delegate'
  userEmail:any;
  userId:any;
  userName:any;
  selectedUserIds: number[] = [];
  nonregist: any[] = [];
  searchForm:any= FormGroup;
  delegate:boolean=false;
  partner:boolean=false;
  speaker:boolean=false
  form:any;
  userNumber:any;
  // title = 'Select/ Unselect All Checkboxes in Angular - FreakyJolly.com';
  masterSelected:boolean | undefined;
  singleSelected:boolean=false;

  private intervalId: any;
  RefreshInterval: any;

  checkedList:any;
  constructor( private datePipe: DatePipe,private fb: FormBuilder, private AdminService: AdminService,private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router,private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,)
   
  {
    this.masterSelected = false;
    
    // this.getCheckedItemList();
  }

  
   ngOnInit(): void {
    this.allDelegate();

    this.createForm();
    // this.allPartner()
    // this.allSpeaker()
    this.getInterval();


  }

  async getInterval() {
  
        this.RefreshInterval = 10000;

        if (this.RefreshInterval) {
          this.intervalId = setInterval(async () => {
            console.log('refreshing......')
            this.allDelegate();
          }, this.RefreshInterval);
        }
   
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
 
  
  }

  createForm(){
    this.searchForm = this.fb.group({
      searchInput: [''] // Initialize with an empty string
    });
  }
  allDelegate() {
    // this.ngxService.start();
    this.AdminService.getApprovedDelegate().subscribe((data: any) => {
      console.log("data",data.data[0]);
      this.nonregist= data.data[0]
      if(this.nonregist.length===0){
        this.notFound=true;
      } else{
        this.notFound = false;
        console.log("false");
      }
      this.searchForm.reset();
      // this.ngxService.stop();
      this.delegate=true
      this.partner=false
      this.speaker=false

    });
  }


  allPartner() {
    // this.ngxService.start();
    this.AdminService.getApprovedPartner().subscribe((data: any) => {
    console.log("data",data.data[0]);
    this.nonregist= data.data[0]
    // this.ngxService.stop();
    if(this.nonregist.length===0){
      this.notFound=true;
    } else{
      this.notFound = false;
      console.log("false");
    }
    this.searchForm.reset();
    this.partner=true;
    this.delegate=false
    this.speaker=false

    });
  }

  allSpeaker() {
    // this.ngxService.start();
    this.AdminService.getApprovedSpeaker().subscribe((data: any) => {
      
      console.log("data",data.data[0]);
      this.nonregist= data.data[0]
      // this.ngxService.stop();
      if(this.nonregist.length===0){
        this.notFound=true;
      } else{
        this.notFound = false;
        console.log("false");
      }
      this.searchForm.reset();
      this.speaker=true
      this.delegate=false
      this.partner=false;
    });
  }
  // Function to update selectedUserIds array when a row is clicked
  updateSelectedUsers(userId: any,userName:any,userEmail:any,userNumber:any) {
    // Check if the user ID is already selected, and toggle selection
    console.log(userId,userName,userEmail,userNumber);
    this.userId=userId;
    this.userName=userName;
    this.userEmail=userEmail;
    this.userNumber=userNumber
    if (this.selectedUserIds.includes(userId)) {
      this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
      console.log("a", this.selectedUserIds);

    } else {
      this.selectedUserIds.push(userId);
      console.log("b", this.selectedUserIds);
    }
  }

  unapproveSelected(): void {
    if (this.selectedUserIds.length === 0) {
      this.SharedService.ToastPopup('',"please select user!" , 'error')

      // Handle the case when no users are selected.
      return;
    }
    // Prepare the payload with selected user IDs and status 0.
    const payload = {
      user_id: this.selectedUserIds.join(','), // Convert array to comma-separated string
      // user_id:this.userId,
      status: 2,      //unapprove
      updated_by: "admin",
      user_name:this.userName,
      user_email:this.userEmail,
      user_number:this.userNumber
    };
    console.log("payload", payload);
    this.ngxService.start();
    this.AdminService.ApprovedUnapproveStatusRegistration(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', data.message, 'success')
      this.selectedUserIds.pop();

      // this.allDelegate();
      setTimeout(() => {
        this.router.navigate(['dashboard/registered-user']);
        console.log("active tab name delegate", this.delegate);
        console.log("active tab name partner", this.partner);
        console.log("active tab name speaker", this.speaker,);
        switch (true) {
          case this.delegate === true:
            console.log("active tab name delegate", this.delegate);
            this.allDelegate();
            break;
          case this.partner === true:
            console.log("active tab name partner", this.partner);
            this.allPartner();
            break;
          case this.speaker === true:
            console.log("active tab name speaker", this.speaker,);
            this.allSpeaker();
            break;
        }
  
      }, 2000); // 2000 milliseconds (2 seconds) delay



    })
  }
  updateAndUnapprovethroughDropdown(userId: number,userName:any,userEmail:any,userNumber:any): void {
    // Update the selected users
    this.updateSelectedUsers(userId,userName,userEmail,userNumber);
  
    // Now, call the unapproveSelected function
    this.unapproveSelected();
  }

  deleteUser(userId: number,userName:any,userEmail:any,userNumber:any): void {
    this.updateSelectedUsers(userId,userName,userEmail,userNumber);
    console.log("delete called",userId);
    
    const payload = {
      user_id:userId 
    };
    console.log("payload", payload);
    this.ngxService.start();
    this.AdminService.DeleteUser(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', data.message, 'success')
      // this.allDelegate();
      setTimeout(() => {
        this.router.navigate(['dashboard/registered-user']);
        switch (true) {
          case this.delegate === true:
            console.log("active tab name delegate", this.delegate);
            this.allDelegate();
            break;
          case this.partner === true:
            console.log("active tab name partner", this.partner);
            this.allPartner();
            break;
          case this.speaker === true:
            console.log("active tab name speaker", this.speaker,);
            this.allSpeaker();
            break;
        }
      }, 2000); // 2000 milliseconds (2 seconds) delay



    })
}
searchDelegateUser(): void {
  const searchValue = this.searchForm.get('searchInput').value;
  console.log("search called", searchValue);
  if (searchValue===null || searchValue.trim() === '') {
    // Display an error toaster here
    this.SharedService.ToastPopup('',"Search value cannot be empty", 'error')
    return; // Exit the function
  }
  const payload = {
    search: searchValue
  };
  console.log("payload", payload);
  this.ngxService.start();
  this.AdminService.SearchDelegateUser(payload).subscribe((data: any) => {
    this.ngxService.stop();  
    this.SharedService.ToastPopup('', 'data fetched successfully', 'success')
    this.nonregist= data.data[0]
    if(this.nonregist.length===0){
      this.notFound=true;
    } else{
      this.notFound = false;
      console.log("false");
    }
    // setTimeout(() => {
    //   this.router.navigate(['dashboard/registered-user']);
    // }, 2000); // 2000 milliseconds (2 seconds) delay
  })
}


SearchPartnerUser(): void {
  const searchValue = this.searchForm.get('searchInput').value;
  console.log("search called", searchValue);
  if (searchValue===null ||searchValue.trim() === '') {
    // Display an error toaster here
    this.SharedService.ToastPopup('',"Search value cannot be empty", 'error')
    return; // Exit the function
  }
  const payload = {
    search: searchValue
  };
  console.log("payload", payload);
  this.ngxService.start();
  this.AdminService.SearchPartnerUser(payload).subscribe((data: any) => {
    this.ngxService.stop();  
    this.SharedService.ToastPopup('', 'data fetched successfully', 'success')
    this.nonregist= data.data[0]
    if(this.nonregist.length===0){
      this.notFound=true;
    } else{
      this.notFound = false;
      console.log("false");
    }
    // setTimeout(() => {
    //   this.router.navigate(['dashboard/registered-user']);
    // }, 2000); // 2000 milliseconds (2 seconds) delay
  })
}
SearchSpeakerUser(): void {
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
  this.AdminService.SearchSpeakerUser(payload).subscribe((data: any) => {
    this.ngxService.stop();  
    this.SharedService.ToastPopup('', 'data fetched successfully', 'success')
    this.nonregist= data.data[0]
    if(this.nonregist.length===0){
      this.notFound=true;
    } else{
      this.notFound = false;
      console.log("false");
    }
    // setTimeout(() => {
    //   this.router.navigate(['dashboard/registered-user']);
    // }, 2000); // 2000 milliseconds (2 seconds) delay
  })
}



resetForm(): void {
  this.searchForm.reset();
  
  console.log("active tab name delegate",this.delegate);
  console.log("active tab name partner",this.partner);
  console.log("active tab name speaker",this.speaker,);
  switch (true) {
    case this.delegate === true:
      this.allDelegate();
      break;
    case this.partner === true:
      this.allPartner();
      break;
    case this.speaker === true:
      this.allSpeaker();
      break;
  }
}
searchUsers() {
  
  console.log("active tab name delegate",this.delegate);
  console.log("active tab name partner",this.partner);
  console.log("active tab name speaker",this.speaker,);

  switch (true) {
    case this.delegate === true:
      this.searchDelegateUser();
      break;
    case this.partner === true:
      this.SearchPartnerUser();
      break;
    case this.speaker === true:
      this.SearchSpeakerUser();
      break;
  }
  
}
// export() {

//   switch (true) {
//     case this.delegate === true:
//       this.form="Delegate Form";
//       break;
//     case this.partner === true:
//       this.form="Partner Form";
//       break;
//     case this.speaker === true:
//       this.form="Speaker Form";
//       break;
//   }
  
//   const options = {
//     fieldSeparator: ',',
//     quoteStrings: '"',
//     decimalSeparator: '.',
//     showLabels: true,
//     showTitle: true,
//     title: 'Registered Users - '+this.form,
//     useTextFile: false,
//     useBom: true,
//     headers: [
      
//       'title',
//       'first_name',
//       'last_name',
//       'department',
//       'company_name',
//       'designation',
//       'mobile_number',
//       'email_id',
//       'website',
//     ],
    
//   };
  


//   const csvExporter = new ExportToCsv(options);
//   csvExporter.generateCsv(this.nonregist);

//   this.SharedService.ToastPopup('Table has exported successfully', '', 'success');
// }


sendmail(userId: number,userName:any,userEmail:any,userNumber:any,qr_code:any,urn_no:any,designation:any,company:any){

  switch (true) {
    case this.delegate === true:
      console.log("active tab name delegate", this.delegate);
    this.form_name="delegate"
      break;
    case this.partner === true:
      console.log("active tab name partner", this.partner);
      this.form_name="partner"
      break;
    case this.speaker === true:
      console.log("active tab name speaker", this.speaker,);
      this.form_name="speaker"

      break;
  }
  // Prepare the payload with selected user IDs and status 0.
  const payload = {
    user_id:userId,
    user_name:userName,
    user_email:userEmail,
    user_number:userNumber,
    qr_code:qr_code,
    urn_no:urn_no,
    designation:designation,
    company:company,
    form_name:this.form_name

  };
  console.log("payload", payload);
  this.ngxService.start();
  this.AdminService.Send_Email(payload).subscribe((data: any) => {
    this.ngxService.stop();
    this.SharedService.ToastPopup('', data.message, 'success')
    // this.allDelegate();
    setTimeout(() => {
      this.router.navigate(['dashboard/registered-user']);
      console.log("active tab name delegate", this.delegate);
      console.log("active tab name partner", this.partner);
      console.log("active tab name speaker", this.speaker,);
      switch (true) {
        case this.delegate === true:
          console.log("active tab name delegate", this.delegate);
          this.allDelegate();
          break;
        case this.partner === true:
          console.log("active tab name partner", this.partner);
          this.allPartner();
          break;
        case this.speaker === true:
          console.log("active tab name speaker", this.speaker,);
          this.allSpeaker();
          break;
      }

    }, 2000); // 2000 milliseconds (2 seconds) delay

  },
  (error: any) => {
    // Handle the error here
    console.error("Error while sending email:", error);
    // You can also display an error message or take appropriate action.
  }
  );

}

Generate_Badge(userId: number,userName:any,userEmail:any,userNumber:any,qr_code:any,urn_no:any,designation:any,company:any){


  switch (true) {
    case this.delegate === true:
      console.log("active tab name delegate", this.delegate);
    this.form_name="delegate"
      break;
    case this.partner === true:
      console.log("active tab name partner", this.partner);
      this.form_name="partner"
      break;
    case this.speaker === true:
      console.log("active tab name speaker", this.speaker,);
      this.form_name="speaker"

      break;
  }
  // Prepare the payload with selected user IDs and status 0.
  const payload = {
    user_id:userId,
    user_name:userName,
    user_email:userEmail,
    user_number:userNumber,
    qr_code:qr_code,
    urn_no:urn_no,
    designation:designation,
    company:company,
    form_name:this.form_name
  };
  console.log("payload", payload);
  this.ngxService.start();
  this.AdminService.Generate_Badge(payload).subscribe((data: any) => {
    this.ngxService.stop();
    this.SharedService.ToastPopup('', data.message, 'success')
    // this.allDelegate();
    setTimeout(() => {
      this.router.navigate(['dashboard/registered-user']);
      console.log("active tab name delegate", this.delegate);
      console.log("active tab name partner", this.partner);
      console.log("active tab name speaker", this.speaker,);
      switch (true) {
        case this.delegate === true:
          console.log("active tab name delegate", this.delegate);
          this.allDelegate();
          break;
        case this.partner === true:
          console.log("active tab name partner", this.partner);
          this.allPartner();
          break;
        case this.speaker === true:
          console.log("active tab name speaker", this.speaker,);
          this.allSpeaker();
          break;
      }

    }, 2000); // 2000 milliseconds (2 seconds) delay

  },
  (error: any) => {
    // Handle the error here
    console.error("Error while sending email:", error);
    // You can also display an error message or take appropriate action.
  }
  );

}

downloadBadge(filepath:any,urn_no:any) {

  const payload = {
    filepath:filepath
  };
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
console.log(payload);

// Make the HTTP request to download the PDF
this.AdminService.Download_Badge(payload)
    .subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      saveAs(blob, `${urn_no}.pdf`); // You can customize the filename
    });

}



export() {
  switch (true) {
    case this.delegate === true:
      this.form = 'Delegates';
      break;
    case this.partner === true:
      this.form = 'Partners';
      break;
    case this.speaker === true:
      this.form = 'Speakers';
      break;
  }

  // Select the columns you want to export
  const columnsToExport = this.nonregist.map(item => {
    // Replace 'columnName' with the actual keys of the columns you want to export
    let modifiedRegistrationType = item.registration_type; // Initialize with the original value
  
    // Check if you want to change the 'registration_type' for specific items
    if (item.registration_type==="1") {
      // Modify 'registration_type' based on your condition
      modifiedRegistrationType = 'Delegate' /* Set the new value here */;
    } else if (item.registration_type==="2") {
      // Modify 'registration_type' based on your condition
      modifiedRegistrationType = 'Partner' /* Set the new value here */;
    }else{
      modifiedRegistrationType = 'Speaker' /* Set the new value here */;

    }
    let modifiedstatus = item.status; // Initialize with the original value
console.log(modifiedstatus==="1");
console.log(typeof modifiedstatus);

    if (item.status==="1") {
      // Modify 'registration_type' based on your condition
      modifiedstatus = 'Registered User' /* Set the new value here */;
    }else{
      modifiedstatus = 'Non-Registered User' /* Set the new value here */;

    }
  
    console.log("created date...........",item.created_date);
    // Assuming item.created_date is a valid date string or Date object
let created_date = this.datePipe.transform(item.created_date, 'yyyy-MM-dd hh:mm a');
let updated_date = this.datePipe.transform(item.updated_date, 'yyyy-MM-dd hh:mm a');

    return {
      'title': item.title, 
      'first_name': item.first_name, 
      'last_name': item.last_name, 
      'email_id':  item.email_id, 
      'country_code':  item.country_code,
      'mobile_number':  item.mobile_number,  
      'country_name':  item.country_name, 
      'profession':  item.profession_1, 
      'address':  item.address, 
      'organization_name':  item.organization_name, 
      'payment_status':  item.TUD_STATUS == 'SUCCESS'?item.TUD_STATUS:'PENDING', 
      'refrence':  item.reference_no, 
      'created_date':  created_date, 
    //   'department':  item.department, 
    //   'designation':  item.designation,
    //   'address_line_2':  item.address_line_2, 
    //   'address_line_3':  item.address_line_3, 
    //   'state_name':  item.state_name, 
    //   'city_name':  item.city_name, 
    //   'website':  item.website, 
    //   'conference_day':  item.conference_day, 
    //   'attending_purpose':  item.attending_purpose, 
    //   'specific_solution':  item.specific_solution, 
    //   'attended_innopack':  item.attended_innopack, 
    //   'is_active':  item.is_active, 
    //   'refrence_url':  item.refrence_url, 
    //   'is_whatsapp_number':  item.is_whatsapp_number, 
    //   'terms_condition':  item.terms_condition, 
    //  'events':  item.events, 
    //  'updated_date':  updated_date, 
    };
  });
  
  const ws = XLSX.utils.json_to_sheet(columnsToExport);
  // const ws = XLSX.utils.json_to_sheet(this.nonregist);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, this.form);

  // You can set additional properties if needed, e.g., a title:
  wb.Props = {
    Title: 'Registered Users - ' + this.form,
  };

  XLSX.writeFile(wb, 'Registered_Users.xlsx');

  // Add your success message or any other functionality here.
  this.SharedService.ToastPopup('Table has exported successfully', '', 'success');

}

}

