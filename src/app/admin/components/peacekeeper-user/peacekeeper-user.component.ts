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
import { interval, Subject, Subscription } from 'rxjs';



@Component({
  selector: 'app-peacekeeper-user',
  templateUrl: './peacekeeper-user.component.html',
  styleUrls: ['./peacekeeper-user.component.css']
})
export class PeacekeeperUserComponent implements OnInit {
  form_name:any;
  notFound:boolean=false;
  activeTab: string = 'delegate'; // Default active tab is 'delegate'
  userEmail:any;
  userId:any;
  userName:any;
  selectedUserIds: number[] = [];
  peacekeeperList: any[] = [];
  searchForm:any= FormGroup;
  peacekeeper:boolean=false;
  private intervalId: any;
  RefreshInterval: any;

  form:any;
  userNumber:any;
  // title = 'Select/ Unselect All Checkboxes in Angular - FreakyJolly.com';
  masterSelected:boolean | undefined;
  singleSelected:boolean=false;
  private refreshSubscription: Subscription;


  checkedList:any;
  constructor( private datePipe: DatePipe,private fb: FormBuilder, private AdminService: AdminService,private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router,private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,)
   
  {
    this.masterSelected = false;
    
    this.refreshSubscription = this.SharedService.refreshPeacekeeper$.subscribe(async () => {
      await this.allPeacekeeper();
    });
    // this.getCheckedItemList();
  }

  
   ngOnInit(): void {
    this.allPeacekeeper();

    this.createForm();
    this.getInterval();


  }

  async getInterval() {
  
        this.RefreshInterval = 10000;

        if (this.RefreshInterval) {
          this.intervalId = setInterval(async () => {
            console.log('refreshing......')
            this.allPeacekeeper();
          }, this.RefreshInterval);
        }
   
  }


  createForm(){
    this.searchForm = this.fb.group({
      searchInput: [''] // Initialize with an empty string
    });
  }
  allPeacekeeper() {
    this.AdminService.getPeacekeeper().subscribe((data: any) => {
      console.log("data",data.data);
      this.peacekeeperList= data.data
      if(this.peacekeeperList.length===0){
        this.notFound=true;
      } else{
        this.notFound = false;
        console.log("false");
      }
      this.searchForm.reset();
      this.peacekeeper=true


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

      // this.allPeacekeeper();
      setTimeout(() => {
        this.router.navigate(['dashboard/peacekeeper']);
        console.log("active tab name delegate", this.peacekeeper);

        switch (true) {
          case this.peacekeeper === true:
            console.log("active tab name delegate", this.peacekeeper);
            this.allPeacekeeper();
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
      // this.allPeacekeeper();
      setTimeout(() => {
        this.router.navigate(['dashboard/peacekeeper']);
        switch (true) {
          case this.peacekeeper === true:
            console.log("active tab name delegate", this.peacekeeper);
            this.allPeacekeeper();
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
    this.peacekeeperList= data.data[0]
    if(this.peacekeeperList.length===0){
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
  
  console.log("active tab name delegate",this.peacekeeper);

  switch (true) {
    case this.peacekeeper === true:
      this.allPeacekeeper();
      break;

  }
}
searchUsers() {
  
  console.log("active tab name delegate",this.peacekeeper);


  switch (true) {
    case this.peacekeeper === true:
      this.searchDelegateUser();
      break;

  }
  
}



sendmail(userId: number,userName:any,userEmail:any,userNumber:any,qr_code:any,urn_no:any,designation:any,company:any){

  switch (true) {
    case this.peacekeeper === true:
      console.log("active tab name delegate", this.peacekeeper);
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
    // this.allPeacekeeper();
    setTimeout(() => {
      this.router.navigate(['dashboard/peacekeeper']);
      console.log("active tab name delegate", this.peacekeeper);

      switch (true) {
        case this.peacekeeper === true:
          console.log("active tab name delegate", this.peacekeeper);
          this.allPeacekeeper();
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
    case this.peacekeeper === true:
      console.log("active tab name delegate", this.peacekeeper);
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
    // this.allPeacekeeper();
    setTimeout(() => {
      this.router.navigate(['dashboard/peacekeeper']);
      console.log("active tab name delegate", this.peacekeeper);


          this.allPeacekeeper();
 


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
  const columnsToExport = this.peacekeeperList.map(item => {

  
    console.log("created date...........",item.created_date);
    // Assuming item.created_date is a valid date string or Date object
let created_date = this.datePipe.transform(item.created_at, 'yyyy-MM-dd hh:mm a');
let updated_date = this.datePipe.transform(item.updated_date, 'yyyy-MM-dd hh:mm a');

    return {
      'full_name': item.full_name, 
      'DOB':  item.dob,
      'country':  item.country,
      'mobile_number':  item.mobile_number,  
      'email_id':  item.email_id, 
     'created_date':  created_date, 
    };
  });
  
  const ws = XLSX.utils.json_to_sheet(columnsToExport);
  // const ws = XLSX.utils.json_to_sheet(this.peacekeeperList);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, this.form);

  // You can set additional properties if needed, e.g., a title:
  wb.Props = {
    Title: 'Peacekeeper Users - ' + this.form,
  };

  XLSX.writeFile(wb, 'Peacekeeper_Users.xlsx');

  // Add your success message or any other functionality here.
  this.SharedService.ToastPopup('Table has exported successfully', '', 'success');

}

ngOnDestroy() {
  clearInterval(this.intervalId);

  if (this.refreshSubscription)
    this.refreshSubscription.unsubscribe();


}


}

