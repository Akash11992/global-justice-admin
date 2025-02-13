import { Component } from '@angular/core';
import { AdminService } from 'src/app/features/admin/services/admin.service';
import { ExportToCsv } from 'export-to-csv';
import { FormGroup, FormControl, Validators, FormControlName, FormBuilder, FormArray, } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-joinmailinglist',
  templateUrl: './joinmailinglist.component.html',
  styleUrls: ['./joinmailinglist.component.css']
})
export class JoinmailinglistComponent {

  joinmailingdata: any[] = [];
  notFound: boolean = false;

  nonregist: any[] = [];
  form: any;
  searchForm: any = FormGroup;

  ngOnInit(): void {
    this.getJoinMailingList();
    this.createForm()

  }


  constructor(private datePipe: DatePipe,private fb: FormBuilder, private AdminService: AdminService, private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router, private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,) {

  }

  getJoinMailingList() {
    // this.ngxService.start();
    this.AdminService.getJoinMailingListEndpoint().subscribe((data: any) => {
      console.log("data", data.data);
      this.nonregist = data.data
      console.log("this.joinmailingdata", this.joinmailingdata);
      if (this.nonregist.length > 0) {
        this.notFound = false;

      } else {
        this.notFound = true;

        console.log("false");
      }
    });
  }

  createForm() {

    this.searchForm = this.fb.group({
      searchInput: [''] // Initialize with an empty string
    });
  }


  // export() {
  //   const options = {
  //     fieldSeparator: ',',
  //     quoteStrings: '"',
  //     decimalSeparator: '.',
  //     showLabels: true,
  //     showTitle: true,
  //     title: 'join-mailing Users',
  //     useTextFile: false,
  //     useBom: true,
  //     headers: [

  //       'mail_id',
  //       'title',
  //       'first_name',
  //       'last_name',
  //       'designation',
  //       'mobile',
  //       'email',
  //       'company_name',
  //       'country',
  //     ],

  //   };



  //   const csvExporter = new ExportToCsv(options);
  //   csvExporter.generateCsv(this.nonregist);

  //   this.SharedService.ToastPopup('Table has exported successfully', '', 'success');
  // }

  export() {
    // Select the columns you want to export
const columnsToExport = this.nonregist.map(item => {
  let created_date = this.datePipe.transform(item.created_date, 'yyyy-MM-dd hh:mm a');
  return {
    'id':  item.mail_id, 
    'title': item.title, // Use the modified value
    'first_name': item.first_name, 
    'last_name': item.last_name, 
    'designation': item.designation, 
    'country':  item.country, 
    'mobile':  item.mobile, 
    'email':  item.email,
    'company_name':  item.company_name,
    'whatsaap_number_check':  item.whatsaap_number_check,  
    'informa_market_check':  item.informa_market_check, 
    'created_date':  created_date, 
  };
});

const ws = XLSX.utils.json_to_sheet(columnsToExport);

    // const ws = XLSX.utils.json_to_sheet(this.nonregist);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Join Mailing Users');
  
    // You can set additional properties if needed, e.g., a title:
    wb.Props = {
      Title: 'Join Mailing Users',
    };
  
    XLSX.writeFile(wb, 'Join_Mailing_Users.xlsx');
  
    // Add your success message or any other functionality here.
    this.SharedService.ToastPopup('Table has exported successfully', '', 'success');

  }

  resetForm(): void {
    this.searchForm.reset();
    this.getJoinMailingList();

  }


  SearchSpeakerUser(): void {
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
    this.AdminService.Searchjoinmail(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', 'data fetched successfully', 'success')
      this.nonregist = data.data[0]
      if (this.nonregist.length === 0) {
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


  deleteUser(mail_id: number): void {

    console.log("delete called", mail_id);
    const payload = {
      mail_id: mail_id
    };
    console.log("payload", payload);
    this.ngxService.start();
    this.AdminService.Deletejoinmailinglist(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', data.message, 'success')
      // this.allDelegate();
  // 2000 milliseconds (2 seconds) delay

  this.resetForm();
    })
  }






}
