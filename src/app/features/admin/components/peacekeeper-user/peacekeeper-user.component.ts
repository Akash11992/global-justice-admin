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
  sortDirection: boolean = false; // True = Ascending, False = Descending

  // FontAwesome icons for sorting
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;



  // new pagination
  totalItems: number = 0;
  page: number = 1;
  limit: number = 25;
  sortBy: string = 'created_at';
  order: string = 'desc';
  search: string = '';
  totalPages: number = 0;
  isLoading: boolean = true;
  isSpinner: number = -1;


  rowOptions = [
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ];



  checkedList: any;
  constructor(private datePipe: DatePipe, private fb: FormBuilder, private AdminService: AdminService, private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router, private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,) {





    this.refreshSubscription = this.SharedService.refreshPeacekeeper$.subscribe(async () => {
      await this.allPeacekeeper();
    });
  }


  ngOnInit(): void {


    // console.log(window.location.origin);
    this.isLoading = true;

    this.allPeacekeeper();

    this.getInterval();


  }

  async getInterval() {
    this.RefreshInterval = 60000;
    if (this.RefreshInterval) {
      this.intervalId = setInterval(async () => {
        this.isSpinner = 1; // Show spinner before fetching data

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
      this.SharedService.ToastPopup('Resent successfully', 'Badge', 'success');

      setTimeout(() => {
        this.allPeacekeeper();
      }, 2000); // 2000 milliseconds (2 seconds) delay
    })
  }

  close() {
    this.display='none';
    this.isViewerOpen = false;
  }






  allPeacekeeper() {

   let body ={
    sort_column: this.sortBy,
    sort_order: this.order,
    search:this.search,
    page_size:this.limit,
    page_no:this.page ,
         
   }
  //  this.ngxService.start();

    this.AdminService.getAllPeacekeeperData(body).subscribe((data: any) => {
      // this.ngxService.stop();

      // const decreptedUser = this.SharedService.decryptData(data.data)

      // this.peacekeeperList = decreptedUser
      this.peacekeeperList = data.peacekeepers.Data
      console.log(this.peacekeeperList , 'peaceList');
      
      if (this.masterSelected) {
        this.peacekeeperList.forEach(item => (item.selected = this.masterSelected));
      }
      this.totalItems = data.peacekeepers.totalCount;
      this.totalPages = Math.ceil(this.totalItems / this.limit);
      
      if (this.peacekeeperList.length === 0) {
        this.notFound = true;
      } else {
        this.notFound = false;
      }
      this.peacekeeper = true

      this.isLoading = false;
      this.isSpinner = -1;


    },
    (error) => {
      this.isSpinner = -1; // Hide spinner even if an error occurs
    });
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


        const headers = [
          'Full name', 'DOB', 'Country', 'Mobile number', 'Email', 'Peacekeeper ID',
           'Coupan discount', 'Coupan code', 'QR URL', 'Created Date'
        ];
    
        // Select the columns you want to export
        const columnsToExport = this.peacekeeperList.map(item => {
          let created_date = this.datePipe.transform(item.created_at, 'yyyy-MM-dd hh:mm a');
    
          return [
            item.full_name, item.dob, item.country, item.mobile_number,
            item.email_id, item.Id_no, item.coupon_discount, item.coupon_code, item.QR_CODE, created_date
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



    // const ws = XLSX.utils.json_to_sheet(this.peacekeeperList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.form);

    // You can set additional properties if needed, e.g., a title:
    wb.Props = {
      Title: 'Peacekeeper Users - ' + this.form,
    };

    XLSX.writeFile(wb, 'Peacekeeper_Users.xlsx');

    // Add your success message or any other functionality here.
    this.SharedService.ToastPopup('Data export successful.', '', 'success');

  }

  ngOnDestroy() {
    clearInterval(this.intervalId);

    if (this.refreshSubscription)
      this.refreshSubscription.unsubscribe();


  }



  downloadQRCode(parent: any) {
    // debugger

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
    
    this.isVisible[index] = !this.isVisible[index];
  }


  openImage(imageUrl: string) {
    this.selectedImage = imageUrl;
    this.isViewerOpen = true;
  }

  closeViewer() {
    this.isViewerOpen = false;
  }





// new pagination

onSelectionChange(selectedValue: string) {
  this.page = 1
  this.limit = +selectedValue;
  this.allPeacekeeper();
}

onSearchClick(searchValue: string) {
  if(searchValue.trim().length === 0){
    this.page = 1
    this.limit = 25;
    this.getInterval();
  }else if (searchValue.charAt(0) === ' ') {
    this.SharedService.ToastPopup('', 'First character should not be a space!', 'error')

    return;
  } else{
    clearInterval(this.intervalId);
  }
  this.search = searchValue.trim();
  this.allPeacekeeper();
}

preventFirstSpace(input: HTMLInputElement) {
  if (input.value.charAt(0) === ' ') {
    input.value = input.value.trim(); // Remove leading space immediately
  }
}


changePage(newPage: number) {
  if (newPage >= 1 && newPage <= this.totalPages) {
    this.page = newPage;
    this.allPeacekeeper();
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
  this.allPeacekeeper();
}







  openLink(link:any) {
    window.open(link, '_blank');
  }

  myOptions = {
    'placement': 'top',
    'showDelay': 500
  }


}

