import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { debounceTime, interval, Subject, Subscription } from 'rxjs';
import { faEye, faEyeSlash, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-peacekeeper-user',
  templateUrl: './peacekeeper-user.component.html',
  styleUrls: ['./peacekeeper-user.component.css']
})
export class PeacekeeperUserComponent implements OnInit {

  @ViewChild('qrCodeCanvas') qrCodeCanvasRef: ElementRef | undefined;

  form_name: any;
  notFound: boolean = false;
  activeTab: string = 'delegate'; // Default active tab is 'delegate'
  userEmail: any;
  userId: any;
  userName: any;
  selectedUserIds: number[] = [];
  peacekeeperList: any[] = [];
  searchForm: any = FormGroup;
  peacekeeper: boolean = false;
  peacekeeperID: any;
  private intervalId: any;
  RefreshInterval: any;

  display: string = '';
  form: any;
  userNumber: any;
  // title = 'Select/ Unselect All Checkboxes in Angular - FreakyJolly.com';
  singleSelected: boolean = false;
  private refreshSubscription: Subscription;
  code: any
  qrCodeData: string | null = null;
  isGenerateQR: boolean = false;
  referralUrl: any = '';
  peaceSearchList: any[] = [];
  filteredPeace: any[] = [];
  totalSelected: number = 0;
  selectAll: boolean = false; // Tracks the "select all" checkbox state
  searchParams: string = '';
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
  private searchSubject = new Subject<string>();
  masterSelected: boolean = false;
  selectedIds: string = '';
  isAnySelected: boolean = false;
  isVisible: boolean[] = [];
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  isViewerOpen = false;
  selectedImage: string = '';

  sortColumn: string = ''; // Column currently being sorted
  sortDirection: boolean = true; // True = Ascending, False = Descending

  // FontAwesome icons for sorting
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  // referralUrl:any ='https://globaljusticeuat.cylsys.com/delegate-registration?code='
  // referralUrl:any ='https://www.justice-love-peace.com/delegate-registration?code='

  checkedList: any;
  constructor(private datePipe: DatePipe, private fb: FormBuilder, private AdminService: AdminService, private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router, private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,) {

    this.groupByPerpage = [
      { name: "10" },
      { name: "25" },
      { name: "50" },
      { name: "100" },
    ];

    // this.searchSubject.pipe(debounceTime(300)).subscribe((searchText) => {
    //   if (searchText.length >= 3) {
    //     this.filterClients(searchText);
    //   } else {
    //     this.filteredClients = [];
    //   }
    // });



    this.refreshSubscription = this.SharedService.refreshPeacekeeper$.subscribe(async () => {
      await this.allPeacekeeper();
    });
    // this.getCheckedItemList();
  }


  ngOnInit(): void {

    this.groupByPerpage = [
      { name: "10" },
      { name: "25" },
      { name: "50" },
      { name: "100" },
    ];
    // console.log(window.location.origin);

    this.allPeacekeeper();

    this.createForm();
    this.getInterval();


  }

  async getInterval() {

    this.RefreshInterval = 60000;

    if (this.RefreshInterval) {
      this.intervalId = setInterval(async () => {
        this.allPeacekeeper();
      }, this.RefreshInterval);
    }

  }


  onSave(): void {
    const payload = {
      peace_id: this.peacekeeperID,
    
    };
    console.log("payload", payload);
    this.ngxService.start();
    this.AdminService.postPeacekeeper(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('resent successfully', 'Badge', 'success');

      setTimeout(() => {
        this.allPeacekeeper();
      }, 2000); // 2000 milliseconds (2 seconds) delay
    })
  }

  close() {
    this.display='none';
    this.isViewerOpen = false;
  }

  createForm() {
    this.searchForm = this.fb.group({
      searchInput: [''] // Initialize with an empty string
    });
  }



searchUsers() {
  this.searchParams = this.searchForm.get('searchInput').value;
  // this.peacekeeperList = this.peacekeeperList.filter((peaceName) =>
  //   peaceName.full_name.toLowerCase().includes(this.searchParams.toLowerCase())
  // );

  clearInterval(this.intervalId);
  // this.searchPeacekeeperUser();
  this.allPeacekeeper();

}

  allPeacekeeper() {

   let body ={
    "page_no":this.paging ,
    "page_size":this.pageSize,
    "name":this.searchParams,
    "email":""
      
   }

    this.AdminService.getAllPeacekeeperData(body).subscribe((data: any) => {

      const decreptedUser = this.SharedService.decryptData(data.data)

      this.peacekeeperList = decreptedUser
      if (this.masterSelected) {
        this.peacekeeperList.forEach(item => (item.selected = this.masterSelected));
      }
      this.totalRecords = this.peacekeeperList.length;

      console.log(this.totalRecords, 'totalRecords');


      let pag = Math.ceil(this.totalRecords / this.pageSize);

      this.totalitems = Array(pag)
        .fill(0)
        .map((x, i) => i + 1);

      this.numberOfPages = Math.ceil(
        this.totalRecords / this.pageSize
      );
      if (this.peacekeeperList.length === 0) {
        this.notFound = true;
      } else {
        this.notFound = false;
        console.log("false1111");
      }
      this.searchForm.reset();
      this.peacekeeper = true


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
    this.peacekeeperList = [];
    this.allPeacekeeper();
  }

  nextPage() {
    if (this.activeItem == this.itemsPageTo) {
      this.itemsPageTo = (this.itemsPageTo + 10);
      this.page++
    }
    this.activeItem++;
    this.globalPageNumber = (this.activeItem * 10 - 10);
    this.peacekeeperList = [];

    this.allPeacekeeper();
  }
  async fnPaging(obj: any) {


    this.globalPageNumber = 0;
    this.pageSize = obj;

    this.peacekeeperList = [];


    await this.allPeacekeeper();


  }
  setActiveItem(item: any) {


    this.activeItem = item;

    this.globalPageNumber = (item * 10 - 10);

    this.allPeacekeeper();

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
  updateAndUnapprovethroughDropdown(userId: number, userName: any, userEmail: any, userNumber: any): void {
    // Update the selected users
    this.updateSelectedUsers(userId, userName, userEmail, userNumber);

    // Now, call the unapproveSelected function
    this.unapproveSelected();
  }


  resetForm(): void {
    this.searchForm.reset();
    this.getInterval();
 
        this.allPeacekeeper();
  
  }


  sendmail(userId: number) {

    // Prepare the payload with selected user IDs and status 0.
    const payload = {
      id: userId,
    };
    this.ngxService.start();
    this.AdminService.Send_Email(payload).subscribe((data: any) => {
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


  resendBadge(peaceID: number, url: any) {
    console.log(this.peacekeeperList);
    this.referralUrl = url;
    this.peacekeeperID = peaceID;
    this.onSave();

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

    // Select the columns you want to export
    const columnsToExport = this.peacekeeperList.map(item => {


      console.log("created date...........", item.created_date);
      // Assuming item.created_date is a valid date string or Date object
      let created_date = this.datePipe.transform(item.created_at, 'yyyy-MM-dd hh:mm a');

      return {
        'full_name': item.full_name,
        'DOB': item.dob,
        'country': item.country,
        'mobile_number': item.mobile_number,
        'email_id': item.email_id,
        'Peacekeeper_ID': item.Id_no,
        'Coupan_Discount': item.coupon_discount,
        'Coupan_Code': item.coupon_code,
        'QR_URL': item.QR_CODE,
        'created_date': created_date,
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



  downloadQRCode(parent: any) {
    // debugger
    console.log(parent);

    let parentElement = null

    if (parent.elementType === "canvas") {
      // fetches base 64 data from canvas
      parentElement = parent.qrcElement.nativeElement
        .querySelector("canvas")
        .toDataURL("image/png")
    } else if (this.qrCodeData === "img" || this.qrCodeData === "url") {
      // fetches base 64 data from image
      // parentElement contains the base64 encoded image src
      // you might use to store somewhere
      parentElement = parent.qrcElement.nativeElement.querySelector("img").src
    } else {
      alert("Set elementType to 'canvas', 'img' or 'url'.")
    }

    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement)
      // saves as image
      const blob = new Blob([blobData], { type: "image/png" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      // name of the file
      link.download = "qrcode"
      link.click()
    }
  }


  private convertBase64ToBlob(Base64Image: any) {
    // SPLIT INTO TWO PARTS
    const parts = Base64Image.split(';base64,');
    // HOLD THE CONTENT TYPE
    const imageType = parts[0].split(':')[1];
    // DECODE BASE64 STRING
    const decodedData = window.atob(parts[1]);
    // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
    const uInt8Array = new Uint8Array(decodedData.length);
    // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // RETURN BLOB IMAGE AFTER CONVERSION
    return new Blob([uInt8Array], { type: imageType });
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


  // Master Checkbox Logic
  checkUncheckAll(): void {
    this.peacekeeperList.forEach(item => (item.selected = this.masterSelected));
    this.updateSelectedIds();
  }

  // Check if All Selected
  isAllSelected(): void {
    this.masterSelected = this.peacekeeperList.every(item => item.selected);
    this.updateSelectedIds();
  }

  // Update Selected IDs
  updateSelectedIds(): void {
    this.selectedIds = this.peacekeeperList
      .filter(item => item.selected)
      .map(item => item.peacekeeper_id).join(',');

  }

  // Delete Single Row
  deletePeacekeeper(peacekeeperId: number): void {
    console.log('1 check', peacekeeperId);
    console.log('all check', this.selectedIds);
    let payload
    if (this.selectedIds) {
      payload = { p_peace_id: this.selectedIds }

    } else {
      payload = { p_peace_id: peacekeeperId.toString() };
    }

    const confirmDelete = confirm('Are you sure you want to delete this row?');
    if (!confirmDelete) return;

    this.AdminService.deletePeacekeeperApi(payload).subscribe(
      (response: any) => {
        this.SharedService.ToastPopup('Row deleted successfully!', '', 'success');
        this.allPeacekeeper(); // Refresh the list
      },
      (error: any) => {
        this.SharedService.ToastPopup('Error deleting row.', '', 'error');
      }
    );
  }

  // Delete Selected Rows
  deleteSelected(): void {
    const confirmDelete = confirm('Are you sure you want to delete the selected rows?');
    if (!confirmDelete) return;

    const payload = { ids: this.selectedIds };

    this.AdminService.deletePeacekeeperApi(payload).subscribe(
      (response: any) => {
        this.SharedService.ToastPopup('Rows deleted successfully!', '', 'success');
        this.allPeacekeeper(); // Refresh the list
      },
      (error: any) => {
        this.SharedService.ToastPopup('Error deleting rows.', '', 'error');
      }
    );
  }


  maskMobileNumber(mobile: string): string {
    // if (!mobile) return '';
    // return mobile.replace(/\d(?=\d{4})/g, '#');
    if (!mobile) return '';

    // Extract country code (assumes it starts with "+")
    const parts = mobile.split(' ');
    let countryCode = '';
    let number = mobile;

    if (parts.length > 1 && parts[0].startsWith('+')) {
      countryCode = parts[0] + ' ';
      number = parts.slice(1).join('');
    }

    // Mask all but the last 4 digits
    return countryCode + number.slice(0, -4).replace(/\d/g, '#') + number.slice(-4);
  }
  

  toggleVisibility(index:any) {
    console.log(index, 'row index');
    
    this.isVisible[index] = !this.isVisible[index];
  }


  openImage(imageUrl: string) {
    this.selectedImage = imageUrl;
    this.isViewerOpen = true;
  }

  closeViewer() {
    this.isViewerOpen = false;
  }


  // Sorting Function
  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection; // Toggle direction
    } else {
      this.sortColumn = column;
      this.sortDirection = true; // Default Ascending
    }

    this.peacekeeperList.sort((a, b) => {
      let valA = a[column] || ''; // Handle null values
      let valB = b[column] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      return this.sortDirection ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }

  openLink(link:any) {
    window.open(link, '_blank');
  }

  myOptions = {
    'placement': 'top',
    'showDelay': 500
  }


}

