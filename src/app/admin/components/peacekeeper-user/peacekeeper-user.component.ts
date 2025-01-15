import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { debounceTime , interval, Subject, Subscription } from 'rxjs';



@Component({
  selector: 'app-peacekeeper-user',
  templateUrl: './peacekeeper-user.component.html',
  styleUrls: ['./peacekeeper-user.component.css']
})
export class PeacekeeperUserComponent implements OnInit {

  @ViewChild('qrCodeCanvas') qrCodeCanvasRef: ElementRef | undefined;

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
  peacekeeperID:any;
  private intervalId: any;
  RefreshInterval: any;


  form:any;
  userNumber:any;
  // title = 'Select/ Unselect All Checkboxes in Angular - FreakyJolly.com';
  singleSelected:boolean=false;
  private refreshSubscription: Subscription;
  couponForm: FormGroup;
  code:any
  qrCodeData: string | null = null;
  isGenerateQR:boolean=false;
  referralUrl:any ='';
  peaceSearchList: any[] = [];
  filteredPeace: any[] = [];
  totalSelected: number = 0;
  selectAll: boolean = false; // Tracks the "select all" checkbox state
  searchParams: string = '';
  pageSize:any = 25;
  paging:any =1;
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
// referralUrl:any ='https://globaljusticeuat.cylsys.com/delegate-registration?code='
// referralUrl:any ='https://www.justice-love-peace.com/delegate-registration?code='

  checkedList:any;
  constructor( private datePipe: DatePipe,private fb: FormBuilder, private AdminService: AdminService,private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router,private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,)

  {

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

    this.couponForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      discount: [7, [Validators.required, Validators.min(1), Validators.max(100)]],
      couponCode: [{ value: '' }], // Disabled for read-only
      qrCode: ['', Validators.required],
    });
    
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
    // this.couponForm.valueChanges.subscribe(() => this.generateCouponCode());

    this.createForm();
    // this.getInterval();


  }

  async getInterval() {
  
        this.RefreshInterval = 10000;

        if (this.RefreshInterval) {
          this.intervalId = setInterval(async () => {
            this.allPeacekeeper();
          }, this.RefreshInterval);
        }
   
  }


  generateCouponCode(): void {
    const firstName = this.couponForm.get('firstName')?.value ;
    const nameParts = firstName.trim().split(' ');  // Split name by space and trim any extra spaces
    const lastName = this.couponForm.get('lastName')?.value || this.couponForm.get('firstName')?.value;
    const country = this.couponForm.get('country')?.value ;
    const email = this.couponForm.get('email')?.value ;
    const mobile = this.couponForm.get('mobile')?.value ;

    
    // Generate parts of the coupon code
    const firstChar = nameParts[0].charAt(0).toUpperCase();
    const lastChar = lastName.charAt(0).toUpperCase();
    const countryChars = country.substring(0, 2).toUpperCase();
    const emailChars = email.substring(0, 2).toUpperCase();
    const mobileStart = mobile.split(' ')[1]?.substring(0, 2) || mobile.substring(0, 2);
    const mobileEnd = mobile.slice(-2);
console.log(mobile.length,'mobile');

    // Combine the parts into a 16-character code
    if(firstName!==""&&lastName!==""&&country!==""&&email!==""&&mobile!==""&&mobile.length>9&&!this.couponForm.get('qrCode')?.value){
      const randomChars = this.generateRandomChars(16 - (firstChar.length + lastChar.length + mobileStart.length + mobileEnd.length + countryChars.length + emailChars.length ));
      const couponCode = `${firstChar}${lastChar}${mobileStart}${mobileEnd}${countryChars}${emailChars}${randomChars}`;
      this.couponForm.get('qrCode')?.setValue((this.referralUrl?this.referralUrl:'https://www.justice-love-peace.com')+'/delegate-registration?code='+couponCode);
      this.couponForm.get('couponCode')?.setValue(couponCode);
    }
    
    // Update the coupon code field
  }

  generateQRCode() {
    debugger
    const qrCodeValue = this.couponForm.get('qrCode')?.value;
    this.qrCodeData = qrCodeValue ? qrCodeValue: null;
    console.log(this.qrCodeData, 'QRcode');


  }
  generateRandomChars(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  onGenerateQR(): void {
    const qrData = this.couponForm.value;
    console.log('QR Data:', qrData);
    // Logic to generate QR code can go here.
  }

  onSave(): void {
    const payload = {
      peace_id:  this.peacekeeperID,
      // coupon_discount:  this.couponForm.get('discount')?.value,
      // QR_CODE:  this.couponForm.get('qrCode')?.value,
      // coupon_code:  this.couponForm.get('couponCode')?.value
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

  close(){   
    this.couponForm.reset();
  }

  createForm(){
    this.searchForm = this.fb.group({
      searchInput: [''] // Initialize with an empty string
    });
  }
  allPeacekeeper() {

    this.AdminService.getPeacekeeper(this.searchParams,this.pageSize, this.paging).subscribe((data: any) => {
      this.peacekeeperList= data.data
      if(this.masterSelected){
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
      if(this.peacekeeperList.length===0){
        this.notFound=true;
      } else{
        this.notFound = false;
        console.log("false1111");
      }
      this.searchForm.reset();
      this.peacekeeper=true


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
    if(this.activeItem == this.itemsPageTo){
      this.itemsPageTo = (this.itemsPageTo+10);
      this.page++
    }
    this.activeItem++;
    this.globalPageNumber = (this.activeItem * 10 - 10);
    this.peacekeeperList = [];

    this.allPeacekeeper();
  }
  async fnPaging(obj:any) {


    this.globalPageNumber = 0;
    this.pageSize = obj;

    this.peacekeeperList = [];


    await  this.allPeacekeeper();


  }
  setActiveItem(item: any) {


    this.activeItem = item;

    this.globalPageNumber = (item * 10 - 10);

    this.allPeacekeeper();

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
  // this.searchParams = this.searchForm.get('searchInput').value;
  // this.peacekeeperList = this.peacekeeperList.filter((peaceName) =>
  //   peaceName.full_name.toLowerCase().includes(this.searchParams.toLowerCase())
  // );
  this.searchDelegateUser();
}



sendmail(userId: number){

   // Prepare the payload with selected user IDs and status 0.
  const payload = {
      id:userId,
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

Generate_QRcode(peaceID: number,first_name:any,last_name:any,userEmail:any,userNumber:any,qr_code:any,urn_no:any,country_code:any,country_name:any,url:any){
console.log(this.peacekeeperList);
this.referralUrl = url;
this.qrCodeData = null
this.isGenerateQR = false;
this.peacekeeperID = peaceID;
const nameParts = first_name.trim().split(' ');  // Split name by space and trim any extra spaces

const firstName = nameParts[0];  // First name
const lastName = nameParts.slice(1).join(' '); 
this.couponForm.patchValue({
  firstName: firstName,
  lastName: lastName,
  country:country_name,
  email: userEmail,
  mobile: userNumber,
})

  switch (true) {
    case this.peacekeeper === true:
      console.log("active tab name delegate", this.peacekeeper);
    this.form_name="delegate"
    this.generateCouponCode()
      break;

  }

  
  // Prepare the payload with selected user IDs and status 0.
  // const payload = {
  //   user_id:userId,
  //   user_name:userName,
  //   user_email:userEmail,
  //   user_number:userNumber,
  //   qr_code:qr_code,
  //   urn_no:urn_no,
  //   designation:designation,
  //   company:company,
  //   form_name:this.form_name
  // };
  // console.log("payload", payload);
  // this.ngxService.start();
  // this.AdminService.Generate_Badge(payload).subscribe((data: any) => {
  //   this.ngxService.stop();
  //   this.SharedService.ToastPopup('', data.message, 'success')
  //   setTimeout(() => {
  //     this.router.navigate(['dashboard/peacekeeper']);
  //     console.log("active tab name delegate", this.peacekeeper);


  //         this.allPeacekeeper();
 


  //   }, 2000); // 2000 milliseconds (2 seconds) delay

  // },
  // (error: any) => {
  //   // Handle the error here
  //   console.error("Error while sending email:", error);
  //   // You can also display an error message or take appropriate action.
  // }
  // );
  // this.couponForm.valueChanges.subscribe(() => this.generateCouponCode());

}

resendBadge(peaceID: number,url:any){
  console.log(this.peacekeeperList);
  this.referralUrl = url;
  this.peacekeeperID = peaceID;
   this.onSave();
  
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

    return {
      'full_name': item.full_name, 
      'DOB':  item.dob,
      'country':  item.country,
      'mobile_number':  item.mobile_number,  
      'email_id':  item.email_id, 
      'Peacekeeper_ID':  item.Id_no, 
      'Coupan_Discount':  item.coupon_discount, 
      'Coupan_Code':  item.coupon_code, 
      'QR_URL':  item.QR_CODE, 
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



downloadQRCode(parent:any) {
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
  console.log('1 check',peacekeeperId );
  console.log('all check', this.selectedIds);
  let payload
  if(this.selectedIds){
     payload = { p_peace_id: this.selectedIds }
     
  }else{
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


myOptions = {
  'placement': 'top',
  'showDelay': 500
}


}

