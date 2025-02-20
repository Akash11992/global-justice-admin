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
  selector: 'app-broucher',
  templateUrl: './broucher.component.html',
  styleUrls: ['./broucher.component.css']
})
export class BroucherComponent {
  broucherdata: any[] = []; notFound: boolean = false;
  nonregist: any[] = [];
  form: any;
  searchForm: any = FormGroup;

  ngOnInit(): void {
    this.getBroucher();
    this.createForm();

  }
  constructor(private datePipe: DatePipe,private fb: FormBuilder, private AdminService: AdminService, private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router, private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,) {

  }

  getBroucher() {
    // this.ngxService.start();
    this.AdminService.getBroucherEndpoint().subscribe((data: any) => {
      console.log("data", data.data);
      this.nonregist = data.data
      console.log("this.broucherdata", this.broucherdata);
      if (this.nonregist.length > 0) {
        this.notFound = false;

      } else {
        this.notFound = true;

        console.log("false");
      }
    });
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
    this.AdminService.Searchbroucher(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', 'Data fetched successfully', 'success')
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
  //     title: 'Broucher Users',
  //     useTextFile: false,
  //     useBom: true,
  //     headers: [

  //       'brochure_id',
  //       'contact_name',
  //       'email',
  //       'job_tittle',
  //       'company_name',
  //       'country',
  //       'phone_number',
  //       'mobile',
  //       'area_of_interest',

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
    'brochure_id':  item.brochure_id, 
    'contact_name': item.contact_name, // Use the modified value
    'email': item.email, 
    'job_title': item.job_tittle, 
    'company_name': item.company_name, 
    'country':  item.country, 
    'phone_number':  item.phone_number,
    'mobile':  item.mobile,
    'area_of_interest':  item.area_of_interest,  
    'check_whatsaap_number':  item.check_whatsaap_number, 
    'check_details':  item.check_details, 
    'created_date':  created_date, 
  };
});

const ws = XLSX.utils.json_to_sheet(columnsToExport);


    // const ws = XLSX.utils.json_to_sheet(this.nonregist);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Brouchers');
  
    // You can set additional properties if needed, e.g., a title:
    wb.Props = {
      Title: 'Broucher Users',
    };
  
    XLSX.writeFile(wb, 'Brouchers.xlsx');
  
    // Add your success message or any other functionality here.
    this.SharedService.ToastPopup('Table has exported successfully', '', 'success');

  }



  resetForm(): void {
    this.searchForm.reset();
    this.getBroucher()

  }


  deleteUser(brochure_id: number): void {

    console.log("delete called", brochure_id);
    const payload = {
      brochure_id: brochure_id
    };
    console.log("payload", payload);
    this.ngxService.start();
    this.AdminService.DeleteBroucher(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', data.message, 'success')
      // this.allDelegate();
  // 2000 milliseconds (2 seconds) delay

  this.resetForm();
    })
  }

  



}
