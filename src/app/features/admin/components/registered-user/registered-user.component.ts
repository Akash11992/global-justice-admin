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
  searchParams: string = '';
  sortParamKey: string = 'name';
  pageSize: any = 25;
  paging: any = 1;
  totalRecords: number = 0;
  totalitems: any;
  itemsPerPage = 10;
  itemsPageTo = 10;
  page = 1;
  numberOfPages: number = 0;
  activeItem: number = 1;
  groupByPerpage: any = [];
  currentPage: any;
  totalcount: any;
  globalPageNumber: number = 0;
  sortColumn: string = ''; // Column currently being sorted
  sortDirection: boolean = true; // True = Ascending, False = Descending

  // FontAwesome icons for sorting
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  constructor(private datePipe: DatePipe, private fb: FormBuilder, private AdminService: AdminService, private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router, private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,) {
    this.groupByPerpage = [
      { name: "10" },
      { name: "25" },
      { name: "50" },
      { name: "100" },
    ];
    this.masterSelected = false;

    // this.getCheckedItemList();
  }


  ngOnInit(): void {
    this.groupByPerpage = [
      { name: "10" },
      { name: "25" },
      { name: "50" },
      { name: "100" },
    ];
    this.allDelegate();

    this.createForm();
    // this.allPartner()
    // this.allSpeaker()
    this.getInterval();

  }

  async getInterval() {

    this.RefreshInterval = 60000;

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

  createForm() {
    this.searchForm = this.fb.group({
      searchInput: [''] // Initialize with an empty string
    });
  }
  allDelegate() {

    let body = {
      "name": this.searchParams,
      "ordering": this.sortParamKey,
      "page_size": this.pageSize,
      "page_no": this.paging

    }

    // this.ngxService.start();
    this.AdminService.getApprovedDelegate(body).subscribe((data: any) => {
      const decreptedUser = this.SharedService.decryptData(data.data)

      console.log("data", decreptedUser);
      this.registeredDelegateList = decreptedUser

      this.totalRecords = this.registeredDelegateList.length;

      console.log(this.totalRecords, 'totalRecords');


      let pag = Math.ceil(this.totalRecords / this.pageSize);

      this.totalitems = Array(pag)
        .fill(0)
        .map((x, i) => i + 1);

      this.numberOfPages = Math.ceil(
        this.totalRecords / this.pageSize
      );

      if (this.registeredDelegateList.length === 0) {
        this.notFound = true;
      } else {
        this.notFound = false;
      }
      this.searchForm.reset();
      // this.ngxService.stop();
      this.delegate = true
    });
  }


  previousPage() {
    if (this.activeItem > 1) {
      this.activeItem--; // Move to the previous item

      // If activeItem is at the start of the page range, update the page and range
      if (this.activeItem < this.itemsPageTo - 9) {
        this.itemsPageTo -= 10; // Update the range to the previous set
        this.page--; // Decrement the page
      }
    }
    this.globalPageNumber = (this.activeItem - 1) * this.itemsPerPage;
    this.registeredDelegateList = [];
    this.allDelegate();
  }

  nextPage() {
    if (this.activeItem == this.itemsPageTo) {
      this.itemsPageTo = (this.itemsPageTo + 10);
      this.page++
    }
    this.activeItem++;
    this.globalPageNumber = (this.activeItem * 10 - 10);
    this.registeredDelegateList = [];

    this.allDelegate();
  }
  async fnPaging(obj: any) {


    this.globalPageNumber = 0;
    this.pageSize = obj;

    this.registeredDelegateList = [];


    await this.allDelegate();


  }
  setActiveItem(item: any) {


    this.activeItem = item;

    this.globalPageNumber = (item * 10 - 10);

    this.allDelegate();

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
      this.SharedService.ToastPopup('', "please select user!", 'error')

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
  searchDelegateUser(): void {
    const searchValue = this.searchForm.get('searchInput').value;
    console.log("search called", searchValue);
    if (searchValue === null || searchValue.trim() === '') {
      // Display an error toaster here
      this.SharedService.ToastPopup('', "Search value cannot be empty", 'error')
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
      this.registeredDelegateList = data.data[0]
      if (this.registeredDelegateList.length === 0) {
        this.notFound = true;
      } else {
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
    this.allDelegate();

  }
  searchUsers() {
    this.searchParams = this.searchForm.get('searchInput').value;


    clearInterval(this.intervalId);
    this.allDelegate();

    // this.searchDelegateUser();

  }


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
    switch (true) {
      case this.delegate === true:
        this.form = 'Delegates';
        break;

    }
    debugger
    // Select the columns you want to export
    const columnsToExport = this.registeredDelegateList.map(item => {

      // Assuming item.created_date is a valid date string or Date object
      let created_date = this.datePipe.transform(item.created_date, 'yyyy-MM-dd hh:mm a');
      let updated_date = this.datePipe.transform(item.updated_date, 'yyyy-MM-dd hh:mm a');

      return {
        'title': item.title,
        'first_name': item.first_name,
        'last_name': item.last_name,
        'email_id': item.email_id,
        'country_code': item.country_code,
        'mobile_number': item.mobile_number,
        'country_name': item.country,
        'profession': item.profession_1,
        'address': item.address,
        'organization_name': item.organization_name,
        'payment_status': item.TUD_STATUS == 'paid' ? item.TUD_STATUS : 'PENDING',
        'payment_transaction': item.TUD_TRANSCATION_ID,
        'refrence': item.reference_no,
        'created_date': created_date,

      };
    });

    const ws = XLSX.utils.json_to_sheet(columnsToExport);
    // const ws = XLSX.utils.json_to_sheet(this.registeredDelegateList);
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

  // Sorting Function
  sortData(queryParamKey: string) {

    if (
      queryParamKey === this.sortParamKey.replace("-", "") &&
      this.sortParamKey.includes("-")
    ) {
      this.sortParamKey = queryParamKey;
    } else {
      this.sortParamKey = "-" + queryParamKey;
    }
    // this.sorticon = this.sorticon ? false : true;
    // this.fnReset(true);
 

    if (this.sortColumn === queryParamKey) {
      this.sortDirection = !this.sortDirection; // Toggle direction
    } else {
      this.sortColumn = queryParamKey;
      this.sortDirection = true; // Default Ascending
    
    }
    this.registeredDelegateList = [];
    this.allDelegate();

    // this.registeredDelegateList.sort((a, b) => {
    //   let valA = a[queryParamKey] || ''; // Handle null values
    //   let valB = b[queryParamKey] || '';

    //   if (typeof valA === 'string') valA = valA.toLowerCase();
    //   if (typeof valB === 'string') valB = valB.toLowerCase();

    //   return this.sortDirection ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    // });
  }
}

