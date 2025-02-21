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
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  form_name: any;
  notFound: boolean = false;
  activeTab: string = 'delegate'; // Default active tab is 'delegate'
  userEmail: any;
  userId: any;
  userName: any;
  selectedUserIds: number[] = [];
  contactUsList: any[] = [];
  searchForm: any = FormGroup;
  contactUs: boolean = false;

  form: any;
  userNumber: any;
  // title = 'Select/ Unselect All Checkboxes in Angular - FreakyJolly.com';
  masterSelected: boolean | undefined;
  singleSelected: boolean = false;
  private intervalId: any;
  RefreshInterval: any;

  checkedList: any;
  totalSelected: number = 0;
  selectAll: boolean = false; // Tracks the "select all" checkbox state
  searchParams: string = '';
  sortParamKey: string = 'name';
  pageSize: any = 25;
  paging: any = 1;
  totalRecords: number = 0;
  totalitems: any;
  itemsPerPage = 10;
  itemsPageTo = 10;
  // page = 1;
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

    this.isLoading = true;

    this.groupByPerpage = [
      { name: "10" },
      { name: "25" },
      { name: "50" },
      { name: "100" },
    ];
    this.allContactUs();

    // this.createForm();
    // this.allPartner()
    // this.allSpeaker()

    this.getInterval();


  }

  async getInterval() {

    this.RefreshInterval = 60000;

    if (this.RefreshInterval) {
      this.intervalId = setInterval(async () => {
        this.isSpinner = 1; // Show spinner before fetching data

        console.log('refreshing......')
        this.allContactUs();
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


  // searchUsers() {
  //   this.searchParams = this.searchForm.get('searchInput').value;

  //   clearInterval(this.intervalId);
  //   this.allContactUs();

  // }

  allContactUs() {
    let body = {
      sort_column: this.sortBy,
      sort_order: this.order,
      search:this.search,
      page_size:this.limit,
      page_no:this.page ,

    }
    // this.ngxService.start();


    this.AdminService.getContactUsApi(body).subscribe((data: any) => {
      // this.ngxService.stop();

      // const decreptedUser = this.SharedService.decryptData(data.data)

      // this.contactUsList = decreptedUser
      this.contactUsList = data.data
      console.log("data", this.contactUsList);

      this.totalItems = data.totalCount;
      this.totalPages = Math.ceil(this.totalItems / this.limit);

      // this.totalRecords = this.contactUsList.length;

      // console.log(this.totalRecords, 'totalRecords');


      // let pag = Math.ceil(this.totalRecords / this.pageSize);

      // this.totalitems = Array(pag)
      //   .fill(0)
      //   .map((x, i) => i + 1);

      // this.numberOfPages = Math.ceil(
      //   this.totalRecords / this.pageSize
      // );


      if (this.contactUsList.length === 0) {
        this.notFound = true;
      } else {
        this.notFound = false;
        console.log("false");
      }
      // this.searchForm.reset();
      // this.ngxService.stop();
      this.contactUs = true
      this.isLoading = false;
      this.isSpinner = -1;

    },
    (error) => {
      this.isSpinner = -1; // Hide spinner even if an error occurs
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
    this.contactUsList = [];
    this.allContactUs();
  }

  nextPage() {
    if (this.activeItem == this.itemsPageTo) {
      this.itemsPageTo = (this.itemsPageTo + 10);
      this.page++
    }
    this.activeItem++;
    this.globalPageNumber = (this.activeItem * 10 - 10);
    this.contactUsList = [];

    this.allContactUs();
  }
  async fnPaging(obj: any) {


    this.globalPageNumber = 0;
    this.pageSize = obj;

    this.contactUsList = [];


    await this.allContactUs();


  }
  setActiveItem(item: any) {


    this.activeItem = item;

    this.globalPageNumber = (item * 10 - 10);

    this.allContactUs();

  }


  export() {

    // Select the columns you want to export
  
    const headers = [
      'SN', 'Title', 'First Name', 'Last Name', 'Mobile Number', 'Email ID',
       'Query', 'Created Date'
    ];

    // Select the columns you want to export
    const columnsToExport = this.contactUsList.map(item => {
      let created_date = this.datePipe.transform(item.created_date, 'yyyy-MM-dd hh:mm a');

      return [
        item.CONTACT_ID, item.TITLE, item.FIRST_NAME, item.LAST_NAME,
        item.PHONE_NUMBER, item.EMAIL, item.YOUR_QUESTION, created_date
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

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.form);

    // You can set additional properties if needed, e.g., a title:
    wb.Props = {
      Title: 'Contact_Us - ' + this.form,
    };

    XLSX.writeFile(wb, 'Contact_Us.xlsx');

    // Add your success message or any other functionality here.
    this.SharedService.ToastPopup('Data export successful.', '', 'success');

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

    this.contactUsList = [];
    this.allContactUs();

 
  }




// new pagination

onSelectionChange(selectedValue: string) {
  this.page = 1
  this.limit = +selectedValue;
  this.allContactUs();
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
  this.allContactUs();
}


preventFirstSpace(input: HTMLInputElement) {
  if (input.value.charAt(0) === ' ') {
    input.value = input.value.trim(); // Remove leading space immediately
  }
}

changePage(newPage: number) {
  if (newPage >= 1 && newPage <= this.totalPages) {
    this.page = newPage;
    this.allContactUs();
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
  this.allContactUs();
}





  myOptions = {
    'placement': 'top',
    'showDelay': 500
  }


}

