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
  selector: 'app-sales-broucher',
  templateUrl: './sales-broucher.component.html',
  styleUrls: ['./sales-broucher.component.css']
})
export class SalesBroucherComponent {
  salesbroucherdata:any[]=[];
  notFound:boolean=false;

  nonregist: any[] = [];
  form: any;
  searchForm: any = FormGroup;

  ngOnInit(): void {
    this.allsalesbroucherdata();
    this.createForm()
    
  }
  constructor(private datePipe: DatePipe,private fb: FormBuilder, private AdminService: AdminService, private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router, private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,) {

  }

  allsalesbroucherdata() {
    // this.ngxService.start();
    this.AdminService.getSalesBroucherEndpoint().subscribe((data: any) => {
      console.log("data",data.data);
      this.salesbroucherdata= data.data
console.log("this.salesbroucherdata",this.salesbroucherdata);

if(this.salesbroucherdata.length>0){
  this.notFound = false;

} else{
  this.notFound=true;

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
  //     title: 'Sales Broucher Users',
  //     useTextFile: false,
  //     useBom: true,
  //     headers: [

  //       'sales_brochure_id',
  //       'first_name',
  //       'last_name',
  //       'designation',
  //       'department',
  //       'company_name',
  //       'work_email',
  //       'work_phone_number',
  //       'city',
  //       'state',
  //       'country',
  //       'postcode'

  //     ],

  //   };



  //   const csvExporter = new ExportToCsv(options);
  //   csvExporter.generateCsv(this.salesbroucherdata);

  //   this.SharedService.ToastPopup('Table has exported successfully', '', 'success');
  // }


  export() {
    // Select the columns you want to export
const columnsToExport = this.salesbroucherdata.map(item => {
  let created_date = this.datePipe.transform(item.created_date, 'yyyy-MM-dd hh:mm a');
  return {
    'sales_brochure_id':  item.sales_brochure_id, 
    'first_name': item.first_name, // Use the modified value
    'last_name': item.last_name, 
    'designation': item.designation, 
    'department': item.department, 
    'company_name':  item.company_name, 
    'work_email':  item.work_email,
    'work_phone_number':  item.work_phone_number,
    'country_name':  item.country_name,
    'state_name':  item.state_name,
    'city_name':  item.city_name,
    'postcode':  item.postcode,  
    'check_whatsaap_number':  item.check_whatsaap_number, 
    'check_details':  item.check_details, 
    'created_date':  created_date, 
  };
});

const ws = XLSX.utils.json_to_sheet(columnsToExport);
    // const ws = XLSX.utils.json_to_sheet(this.salesbroucherdata);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Brouchers');
  
    // You can set additional properties if needed, e.g., a title:
    wb.Props = {
      Title: 'Sales Broucher Users',
    };
  
    XLSX.writeFile(wb, 'Sales_Brouchers.xlsx');
  
    // Add your success message or any other functionality here.
    this.SharedService.ToastPopup('Table has exported successfully', '', 'success');

  }

  resetForm(): void {
    this.searchForm.reset();
    this.allsalesbroucherdata();

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
    this.AdminService.Searchsalesbroucher(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', 'data fetched successfully', 'success')
      this.salesbroucherdata = data.data[0]
      if (this.salesbroucherdata.length === 0) {
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



  deleteUser(sales_brochure_id: number): void {

    console.log("delete called", sales_brochure_id);
    const payload = {
      sales_brochure_id: sales_brochure_id
    };
    console.log("payload", payload);
    this.ngxService.start();
    this.AdminService.deletesalesbroucher(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', data.message, 'success')
      // this.allDelegate();
  // 2000 milliseconds (2 seconds) delay

  this.resetForm();
    })
  }



}
