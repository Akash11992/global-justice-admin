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
import { faEye, faEyeSlash, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  form_name:any;
  notFound:boolean=false;
  activeTab: string = 'delegate'; // Default active tab is 'delegate'
  userEmail:any;
  userId:any;
  userName:any;
  selectedUserIds: number[] = [];
  contactUsList: any[] = [];
  searchForm:any= FormGroup;
  contactUs:boolean=false;

  form:any;
  userNumber:any;
  // title = 'Select/ Unselect All Checkboxes in Angular - FreakyJolly.com';
  masterSelected:boolean | undefined;
  singleSelected:boolean=false;
  private intervalId: any;
  RefreshInterval: any;

  checkedList:any;

  sortColumn: string = ''; // Column currently being sorted
  sortDirection: boolean = true; // True = Ascending, False = Descending

  // FontAwesome icons for sorting
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;

  constructor( private datePipe: DatePipe,private fb: FormBuilder, private AdminService: AdminService,private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router,private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,)
   
  {
    this.masterSelected = false;
    
    // this.getCheckedItemList();
  }

  
   ngOnInit(): void {
    this.allContactUs();

    this.createForm();
    // this.allPartner()
    // this.allSpeaker()
    
    // this.getInterval();


  }

  async getInterval() {
  
        this.RefreshInterval = 60000;

        if (this.RefreshInterval) {
          this.intervalId = setInterval(async () => {
            console.log('refreshing......')
            this.allContactUs();
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
  allContactUs() {
    // this.ngxService.start();
    this.AdminService.getContactUsApi().subscribe((data: any) => {
      console.log("data",data.data);
      this.contactUsList= data.data
      if(this.contactUsList.length===0){
        this.notFound=true;
      } else{
        this.notFound = false;
        console.log("false");
      }
      this.searchForm.reset();
      // this.ngxService.stop();
      this.contactUs=true


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

      // this.allContactUs();
      setTimeout(() => {
        this.router.navigate(['dashboard/peacekeeper']);
        console.log("active tab name delegate", this.contactUs);

        switch (true) {
          case this.contactUs === true:
            console.log("active tab name delegate", this.contactUs);
            this.allContactUs();
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
      // this.allContactUs();
      setTimeout(() => {
        this.router.navigate(['dashboard/peacekeeper']);
        switch (true) {
          case this.contactUs === true:
            console.log("active tab name delegate", this.contactUs);
            this.allContactUs();
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
    this.contactUsList= data.data[0]
    if(this.contactUsList.length===0){
      this.notFound=true;
    } else{
      this.notFound = false;
      console.log("false");
    }
    // setTimeout(() => {
    //   this.router.navigate(['dashboard/peacekeeper']);
    // }, 2000); // 2000 milliseconds (2 seconds) delay
  })
}




resetForm(): void {
  this.searchForm.reset();
  
  console.log("active tab name delegate",this.contactUs);

  switch (true) {
    case this.contactUs === true:
      this.allContactUs();
      break;

  }
}
searchUsers() {
  
  console.log("active tab name delegate",this.contactUs);


  switch (true) {
    case this.contactUs === true:
      this.searchDelegateUser();
      break;

  }
  
}



sendmail(userId: number,userName:any,userEmail:any,userNumber:any,qr_code:any,urn_no:any,designation:any,company:any){

  switch (true) {
    case this.contactUs === true:
      console.log("active tab name delegate", this.contactUs);
    this.form_name="delegate"
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
    // this.allContactUs();
    setTimeout(() => {
      this.router.navigate(['dashboard/peacekeeper']);
      console.log("active tab name delegate", this.contactUs);

      switch (true) {
        case this.contactUs === true:
          console.log("active tab name delegate", this.contactUs);
          this.allContactUs();
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
    case this.contactUs === true:
      console.log("active tab name delegate", this.contactUs);
    this.form_name="delegate"
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
    // this.allContactUs();
    setTimeout(() => {
      this.router.navigate(['dashboard/peacekeeper']);
      console.log("active tab name delegate", this.contactUs);


          this.allContactUs();
 


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

  // Select the columns you want to export
  const columnsToExport = this.contactUsList.map(item => {

  
    console.log("created date...........",item.created_date);
    // Assuming item.created_date is a valid date string or Date object
let created_date = this.datePipe.transform(item.created_at, 'yyyy-MM-dd hh:mm a');
let updated_date = this.datePipe.transform(item.updated_date, 'yyyy-MM-dd hh:mm a');

    return {
      'SN':  item.CONTACT_ID, 
      'TITLE': item.TITLE, 
      'FIRST_NAME': item.FIRST_NAME, 
      'LAST_NAME': item.LAST_NAME, 
      'PHONE_NUMBER':  item.PHONE_NUMBER,  
      'EMAIL':  item.EMAIL,  
      'query':  item.YOUR_QUESTION,  
    };
  });
  
  const ws = XLSX.utils.json_to_sheet(columnsToExport);
  // const ws = XLSX.utils.json_to_sheet(this.contactUsList);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, this.form);

  // You can set additional properties if needed, e.g., a title:
  wb.Props = {
    Title: 'Contact_Us - ' + this.form,
  };

  XLSX.writeFile(wb, 'Contact_Us.xlsx');

  // Add your success message or any other functionality here.
  this.SharedService.ToastPopup('Table has exported successfully', '', 'success');

}

 // Sorting Function
 sortData(column: string) {
  if (this.sortColumn === column) {
    this.sortDirection = !this.sortDirection; // Toggle direction
  } else {
    this.sortColumn = column;
    this.sortDirection = true; // Default Ascending
  }

  this.contactUsList.sort((a, b) => {
    let valA = a[column] || ''; // Handle null values
    let valB = b[column] || '';

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    return this.sortDirection ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });
}

myOptions = {
  'placement': 'top',
  'showDelay': 500
}


}

