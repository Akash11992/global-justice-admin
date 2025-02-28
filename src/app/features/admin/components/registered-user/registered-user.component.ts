import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName, FormBuilder, FormArray, } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ExportToCsv } from 'export-to-csv';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { faEye, faEyeSlash, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-registered-user',
  templateUrl: './registered-user.component.html',
  styleUrls: ['./registered-user.component.css']
})

export class RegisteredUserComponent {
  form_name: any;
  notFound: boolean = false;
  activeTab: string = 'delegate'; // Default active tab is 'delegate'
  userEmail: any;
  userId: any;
  userName: any;
  selectedUserIds: number[] = [];
  registeredDelegateList: any[] = [];
  searchForm: any = FormGroup;
  delegate: boolean = false;
  form: any;
  userNumber: any;
  // title = 'Select/ Unselect All Checkboxes in Angular - FreakyJolly.com';
  singleSelected: boolean = false;
  masterSelected: boolean = false;
  selectedIds: string = '';
  isAnySelected: boolean = false;
  private intervalId: any;
  RefreshInterval: any;

  checkedList: any;

  selectAll: boolean = false; // Tracks the "select all" checkbox state

  sortColumn: string = ''; // Column currently being sorted
  sortDirection: boolean = true; // True = Ascending, False = Descending

  // FontAwesome icons for sorting
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;


  // new pagination
  totalItems: number = 0;
  page: number = 1;
  limit: number = 25;
  sortBy: string = 'created_date';
  order: string = 'desc';
  search: string = '';
  totalPages: number = 0;
  isLoading: boolean = true;
  isSpinner: number = -1;
  isFromSponsorship:boolean = false;
  sponsorshipId:any;
  sponsorshipName:any;

  rowOptions = [
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ];




  constructor(private datePipe: DatePipe, private fb: FormBuilder, private AdminService: AdminService, private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router, private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,) {
 
    this.masterSelected = false;

    // this.getCheckedItemList();
  }


  ngOnInit(): void {
    this.isLoading = this.SharedService.isLoading;

    this.ActivatedRoute.queryParams.subscribe(params => {
      if ((params['type'] && params['type'] == 'DELEGATE_SPONSERED') && 
        (params['id'] && params['id'] !=='')) {
            this.isFromSponsorship = true;
            this.sponsorshipId = params['id'];
            this.sponsorshipName = params['name'];

            this.allDelegate();
            this.getInterval();
      }else{
            this.isFromSponsorship = false;
            this.sponsorshipId = "";
            this.sponsorshipName = "";
            this.allDelegate();
            this.getInterval();
      }
    })
  }

  async getInterval() {

    this.RefreshInterval = 60000;

    if (this.RefreshInterval) {
      this.intervalId = setInterval(async () => {
        this.isSpinner = 1; // Show spinner before fetching data
        console.log('refreshing......')
        this.allDelegate();
      }, this.RefreshInterval);
    }

  }
  ngOnDestroy() {
    clearInterval(this.intervalId);


  }

  // createForm() {
  //   this.searchForm = this.fb.group({
  //     searchInput: [''] // Initialize with an empty string
  //   });
  // }
  allDelegate() {

    let body:any = {
      sort_column: this.sortBy,
      sort_order: this.order,
      search:this.search,
      page_size:this.limit,
      page_no:this.page ,
    };

    if(this.isFromSponsorship){
      body['p_type'] = "DELEGATE_SPONSERED";
      body['p_reference_by'] = this.sponsorshipId;

    }

    // this.ngxService.start();
    this.AdminService.getApprovedDelegate(body).subscribe((data: any) => {
      // this.ngxService.stop();

      // const decreptedUser = this.SharedService.decryptData(data.data)

      // this.registeredDelegateList = decreptedUser totalCount
      this.registeredDelegateList = data.data
      console.log("data", this.registeredDelegateList);


      if (this.masterSelected) {
        this.registeredDelegateList.forEach(item => (item.selected = this.masterSelected));
      }
      this.totalItems = data.totalCount;
      this.totalPages = Math.ceil(this.totalItems / this.limit);

      if (this.registeredDelegateList.length === 0) {
        this.notFound = true;
      } else {
        this.notFound = false;
      }
      // this.searchForm.reset();
      // this.ngxService.stop();
      this.delegate = true
      this.isLoading = false;
      this.isSpinner = -1;

    },
    (error) => {
      this.isSpinner = -1; // Hide spinner even if an error occurs
    });
  }





  // Master Checkbox Logic
  checkUncheckAll(): void {
    this.registeredDelegateList.forEach(item => (item.selected = this.masterSelected));
    this.updateSelectedIds();
  }

  // Check if All Selected
  isAllSelected(): void {
    this.masterSelected = this.registeredDelegateList.every(item => item.selected);
    this.updateSelectedIds();
  }

  // Update Selected IDs
  updateSelectedIds(): void {
    this.selectedIds = this.registeredDelegateList
      .filter(item => item.selected)
      .map(item => item.peacekeeper_id).join(',');

  }

  // Function to update selectedUserIds array when a row is clicked
  updateSelectedUsers(userId: any, userName: any, userEmail: any, userNumber: any) {
    // Check if the user ID is already selected, and toggle selection
    console.log(userId, userName, userEmail, userNumber);
    this.userId = userId;
    this.userName = userName;
    this.userEmail = userEmail;
    this.userNumber = userNumber
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
      this.SharedService.ToastPopup('', "Please select user!", 'error')

      // Handle the case when no users are selected.
      return;
    }
    // Prepare the payload with selected user IDs and status 0.
    const payload = {
      user_id: this.selectedUserIds.join(','), // Convert array to comma-separated string
      // user_id:this.userId,
      status: 2,      //unapprove
      updated_by: "admin",
      user_name: this.userName,
      user_email: this.userEmail,
      user_number: this.userNumber
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
        this.allDelegate();
      }, 2000); // 2000 milliseconds (2 seconds) delay



    })
  }
  updateAndUnapprovethroughDropdown(userId: number, userName: any, userEmail: any, userNumber: any): void {
    // Update the selected users
    this.updateSelectedUsers(userId, userName, userEmail, userNumber);

    // Now, call the unapproveSelected function
    this.unapproveSelected();
  }

  deleteUser(userId: number, userName: any, userEmail: any, userNumber: any): void {
    this.updateSelectedUsers(userId, userName, userEmail, userNumber);
    console.log("delete called", userId);

    const payload = {
      user_id: userId
    };
    console.log("payload", payload);
    this.ngxService.start();
    this.AdminService.DeleteUser(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', data.message, 'success')
      // this.allDelegate();
      setTimeout(() => {
        this.router.navigate(['dashboard/registered-user']);
        this.allDelegate();
      }, 2000); // 2000 milliseconds (2 seconds) delay



    })
  }

  // searchDelegateUser(): void {
  //   const searchValue = this.searchForm.get('searchInput').value;
  //   console.log("search called", searchValue);
  //   if (searchValue === null || searchValue.trim() === '') {
  //     // Display an error toaster here
  //     this.SharedService.ToastPopup('', "Search value cannot be empty", 'error')
  //     return; // Exit the function
  //   }
  //   const payload = {
  //     search: searchValue
  //   };
  //   console.log("payload", payload);
  //   this.ngxService.start();
  //   this.AdminService.SearchDelegateUser(payload).subscribe((data: any) => {
  //     this.ngxService.stop();
  //     this.SharedService.ToastPopup('', 'data fetched successfully', 'success')
  //     this.registeredDelegateList = data.data[0]
  //     if (this.registeredDelegateList.length === 0) {
  //       this.notFound = true;
  //     } else {
  //       this.notFound = false;
  //       console.log("false");
  //     }
  //     // setTimeout(() => {
  //     //   this.router.navigate(['dashboard/registered-user']);
  //     // }, 2000); // 2000 milliseconds (2 seconds) delay
  //   })
  // }

  // resetForm(): void {
  //   this.searchForm.reset();
  //   this.searchParams = '';
  //   this.getInterval();
  //   this.allDelegate();

  // }
  // searchUsers() {
  //   this.searchParams = this.searchForm.get('searchInput').value;


  //   clearInterval(this.intervalId);
  //   this.allDelegate();

  //   // this.searchDelegateUser();

  // }


  sendmail(userId: number, userName: any, userEmail: any, userNumber: any, qr_code: any, urn_no: any, designation: any, company: any) {

    switch (true) {
      case this.delegate === true:
        console.log("active tab name delegate", this.delegate);
        this.form_name = "delegate"
        break;

    }
    // Prepare the payload with selected user IDs and status 0.
    const payload = {
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      user_number: userNumber,
      qr_code: qr_code,
      urn_no: urn_no,
      designation: designation,
      company: company,
      form_name: this.form_name

    };
    console.log("payload", payload);
    this.ngxService.start();
    this.AdminService.Send_Email(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', data.message, 'success')
      // this.allDelegate();
      setTimeout(() => {
        this.router.navigate(['dashboard/registered-user']);
        this.allDelegate();
      }, 2000); // 2000 milliseconds (2 seconds) delay

    },
      (error: any) => {
        // Handle the error here
        console.error("Error while sending email:", error);
        // You can also display an error message or take appropriate action.
      }
    );

  }

  Generate_Badge(userId: number, userName: any, userEmail: any, userNumber: any, qr_code: any, urn_no: any, designation: any, company: any) {


    switch (true) {
      case this.delegate === true:
        console.log("active tab name delegate", this.delegate);
        this.form_name = "delegate"
        break;

    }
    // Prepare the payload with selected user IDs and status 0.
    const payload = {
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      user_number: userNumber,
      qr_code: qr_code,
      urn_no: urn_no,
      designation: designation,
      company: company,
      form_name: this.form_name
    };
    console.log("payload", payload);
    this.ngxService.start();
    this.AdminService.Generate_Badge(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', data.message, 'success')
      // this.allDelegate();
      setTimeout(() => {
        this.router.navigate(['dashboard/registered-user']);
        this.allDelegate();

      }, 2000); // 2000 milliseconds (2 seconds) delay

    },
      (error: any) => {
        // Handle the error here
        console.error("Error while sending email:", error);
        // You can also display an error message or take appropriate action.
      }
    );

  }

  downloadBadge(filepath: any, urn_no: any) {

    const payload = {
      filepath: filepath
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
        this.form = 'Delegates';

    // Capitalized headers with first letter in uppercase
    const headers = [
      'Title', 'First Name', 'Last Name', 'Email ID', 'Country Code',
      'Mobile Number', 'Country Name', 'Profession', 'Address',
      'Organization Name', 'Payment Status', 'Payment Transaction',
      'Reference', 'Created Date'
    ];

    // Select the columns you want to export
    const columnsToExport = this.registeredDelegateList.map(item => {
      let created_date = this.datePipe.transform(item.created_date, 'yyyy-MM-dd hh:mm a');

      return [
        item.title, item.first_name, item.last_name, item.email_id,
        item.country_code, item.mobile_number, item.country,
        item.profession_1, item.address, item.organization_name,
        item.TUD_STATUS === 'paid' ? item.TUD_STATUS : 'PENDING',
        item.TUD_TRANSCATION_ID, item.reference_no, created_date
      ];
    });

    // Insert headers at the first row
    columnsToExport.unshift(headers);

    // Convert JSON to worksheet
    const ws = XLSX.utils.aoa_to_sheet(columnsToExport);
    // Auto-adjust column width based on the longest content
    const columnWidths = headers.map((header, colIndex) => {
      const maxLength = Math.max(
        header.length, // Header length
        ...columnsToExport.map(row => (row[colIndex] ? row[colIndex].toString().length : 0)) // Longest data cell in the column
      );
      return { wch: maxLength + 2 }; // Add padding for better spacing
    });

    // Apply calculated column widths
    ws['!cols'] = columnWidths;
    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.form);

    // Write the workbook to a file
    XLSX.writeFile(wb, 'Registered_Users.xlsx');

    // Add your success message or any other functionality here.
    this.SharedService.ToastPopup('Data export successful.', '', 'success');

  }




// new pagination

onSelectionChange(selectedValue: string) {
  this.page = 1
  this.limit = +selectedValue;
  this.allDelegate();
}

onSearchClick(searchValue: string) {
  if(searchValue.trim().length === 0){
    this.page = 1
    this.limit = 25;
    this.getInterval();
  }else if (searchValue.charAt(0) === ' ') {
    this.SharedService.ToastPopup('', 'First character should not be a space!', 'error')
    return;
  } else {
    clearInterval(this.intervalId);
  }
  this.search = searchValue.trim();
  this.allDelegate();
}

preventFirstSpace(input: HTMLInputElement) {
  if (input.value.charAt(0) === ' ') {
    input.value = input.value.trim(); // Remove leading space immediately
  }
}

changePage(newPage: number) {
  if (newPage >= 1 && newPage <= this.totalPages) {
    this.page = newPage;
    this.allDelegate();
  }
}

onSort(column: string) {
  this.sortBy = column;
  this.order = this.order === 'asc' ? 'desc' : 'asc';

  if (this.sortColumn === column) {
    this.sortDirection = !this.sortDirection; // Toggle direction
  } else {
    this.sortColumn = column;
    this.sortDirection = true; // Default Ascending
  
  }
  this.allDelegate();
}

onActivateDeactiveToggle(item:any):any{
  console.log(item);
  this.ngxService.start();
  const payload = {
    tu_type:item.tu_type,
    tu_reference_by: item.tu_reference_by,
    is_active:+!item.is_active
  };
  
  this.AdminService.updateDelegateByTypeRef(payload).subscribe((data: any) => {
    this.ngxService.stop();
    this.SharedService.ToastPopup('Delegate updated successfully', 'Delegate', 'success');
  },
  (error: any) => {
    this.ngxService.stop();
    this.SharedService.ToastPopup('Oops failed to update delegate', 'Delegate', 'error');
  }
  )
}






}

