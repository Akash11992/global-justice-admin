import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName, FormBuilder, FormArray, } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ExportToCsv } from 'export-to-csv';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-non-registered-user',
  templateUrl: './non-registered-user.component.html',
  styleUrls: ['./non-registered-user.component.css']
})
export class NonRegisteredUserComponent {
  searchForm: any = FormGroup;
  notFound: boolean = false;
  form_name:any;
  userName: any;
  userEmail: any;
  urn_no:any;
  company: any;
  qr_code:any;
  user_number:any;
  designation: any;
  selectAll: boolean = false;
  selectedUserIds: number[] = [];
  selectedUserNames: string[] = [];
selectedQRCodes: string[] = [];
selectedURNs: string[] = [];
selectedDesignations: string[] = [];
selectedCompanies: string[] = [];
selectedUserEmails: string[] = [];
selectedUserNumbers: string[] = [];

  nonregist: any[] = [];
  checklist: any[] = [];
  singleSelectedValue: any;
  delegate: boolean = false;
  partner: boolean = false;
  speaker: boolean = false
  masterSelected: boolean | undefined;
  singleSelected: boolean = false;
  checkedList: any;
  checked: any;
  form:any;
  constructor(private datePipe: DatePipe,private fb: FormBuilder, private AdminService: AdminService, private SharedService: SharedService, private ngxService: NgxUiLoaderService, private router: Router, private ActivatedRoute: ActivatedRoute, private httpClient: HttpClient,) {
    this.masterSelected = false;
  }
  ngOnInit(): void {
    this.allDelegate();
    this.createForm();

  }
  createForm() {
    this.searchForm = this.fb.group({
      searchInput: [''] // Initialize with an empty string
    });
  }
  allDelegate() {
    // this.ngxService.start();
    this.AdminService.getDelegate().subscribe((data: any) => {
      console.log("data", data.data[0]);
      this.nonregist = data.data[0]
      // this.ngxService.stop();
      if(this.nonregist.length===0){
        this.notFound=true;
      } else{
        this.notFound = false;
        console.log("false");
      }
      this.searchForm.reset();
      this.delegate = true
      this.partner = false
      this.speaker = false
  
    });
  }
  allPartner() {
    // this.ngxService.start();
    this.AdminService.getPartner().subscribe((data: any) => {
      console.log("data", data.data[0]);
      this.nonregist = data.data[0]
      // this.ngxService.stop();
      if(this.nonregist.length===0){
        this.notFound=true;
      } else{
        this.notFound = false;
        console.log("false");
      }
      this.searchForm.reset();
      this.partner = true;
      this.delegate = false
      this.speaker = false

    });
  }
  allSpeaker() {
    // this.ngxService.start();
    this.AdminService.getSpeaker().subscribe((data: any) => {
      console.log("data", data.data[0]);
      this.nonregist = data.data[0]
      // this.ngxService.stop();
      if(this.nonregist.length===0){
        this.notFound=true;
      } else{
        this.notFound = false;
        console.log("false");
      }
      this.searchForm.reset();
      this.speaker = true;
      this.delegate = false;
      this.partner = false;
    });
  }

  // Function to update selectedUserIds array when a row is clicked
  updateSelectedUsers(userId: any, userName: any, userEmail: any, company: any, designation: any,urn:any,qr_code:any,user_number:any) {
    // Check if the user ID is already selected, and toggle selection
    console.log(userId, userName, userEmail);
    this.userName = userName;
    this.userEmail = userEmail;
    this.company = company;
    this.designation = designation;
    this.urn_no=urn;
    this.qr_code=qr_code;
    this.user_number=user_number
    // Convert userId to a number
    const id = Number(userId);

    if (this.selectedUserIds.includes(id)) {
      this.selectedUserIds = this.selectedUserIds.filter(selectedId => selectedId !== id);
      this.selectedUserNames = this.selectedUserNames.filter((userName, index) => this.selectedUserIds[index] !== id);
      this.selectedUserEmails = this.selectedUserEmails.filter((userEmail, index) => this.selectedUserIds[index] !== id);
      this.selectedCompanies = this.selectedCompanies.filter((company, index) => this.selectedUserIds[index] !== id);
      this.selectedDesignations = this.selectedDesignations.filter((designation, index) => this.selectedUserIds[index] !== id);
      this.selectedURNs = this.selectedURNs.filter((urn, index) => this.selectedUserIds[index] !== id);
      this.selectedQRCodes = this.selectedQRCodes.filter((qr_code, index) => this.selectedUserIds[index] !== id);
      this.selectedUserNumbers = this.selectedUserNumbers.filter((user_number, index) => this.selectedUserIds[index] !== id);

    } else {
      this.selectedUserIds.push(id);
      this.selectedUserNames.push(userName);
      this.selectedUserEmails.push(userEmail);
      this.selectedCompanies.push(company);
      this.selectedDesignations.push(designation);
      this.selectedURNs.push(urn);
      this.selectedQRCodes.push(qr_code);
      this.selectedUserNumbers.push(user_number);

    }

    console.log('selectedUserIds:', this.selectedUserIds);
  console.log('selectedUserNames:', this.selectedUserNames);
  
  console.log('selectedUserEmails:', this.selectedUserEmails);
  console.log('selectedCompanies:', this.selectedCompanies);
  
  console.log('selectedDesignations:', this.selectedDesignations);
  console.log('selectedURNs:', this.selectedURNs);
  
  console.log('selectedQRCodes:', this.selectedQRCodes);
  console.log('selectedUserNumbers:', this.selectedUserNumbers);
  }

  approveAndRegisterSelected(): void {
    if (this.selectedUserIds.length === 0) {
      this.SharedService.ToastPopup('',"please select record!" , 'error')

      // Handle the case when no users are selected.
      return;
    }

    switch (true) {
      case this.delegate === true:
        console.log("active tab name delegate", this.delegate);
      this.form_name="delegate"
        break;
      case this.partner === true:
        console.log("active tab name partner", this.partner);
        this.form_name="partner"
        break;
      case this.speaker === true:
        console.log("active tab name speaker", this.speaker,);
        this.form_name="speaker"
  
        break;
    }
    // Prepare the payload with selected user IDs and status 0.
    const payload = {
      user_id: this.selectedUserIds.join(','), // Convert array to comma-separated string
      status: 1, //approve
      updated_by: "admin",
      // user_name: this.userName,
      // user_email: this.userEmail,
      // company: this.company,
      // designation: this.designation,
      // urn_no:this.urn_no,
      // qr_code:this.qr_code,
      // user_number:this.user_number

      user_name: this.selectedUserNames.join(','),
      user_email: this.selectedUserEmails.join(','),
      company:this.selectedCompanies.join(','),
      designation:  this.selectedDesignations.join(','),
      urn_no:this.selectedURNs.join(','),
      qr_code:this.selectedQRCodes.join('|'),
      user_number:this.selectedUserNumbers.join(','),
      form_name:this.form_name

    };
    console.log("payload", payload);
    this.ngxService.start();
    this.AdminService.ApprovedUnapproveStatusRegistration(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', data.message, 'success')
       // Clear the selected arrays after successful unapprove
 this.selectedUserIds = [];
 this.selectedUserNames = [];
 this.selectedUserEmails = [];
 this.selectedCompanies = [];
 this.selectedDesignations = [];
 this.selectedURNs = [];
 this.selectedQRCodes = [];
 this.selectedUserNumbers = [];
 setTimeout(() => {
      this.router.navigate(['dashboard/non-registered-user']);
      console.log("active tab name delegate", this.delegate);
      console.log("active tab name partner", this.partner);
      console.log("active tab name speaker", this.speaker,);
      switch (true) {
        case this.delegate === true:
          console.log("active tab name delegate", this.delegate);
          this.allDelegate();
          break;
        case this.partner === true:
          console.log("active tab name partner", this.partner);
          this.allPartner();
          break;
        case this.speaker === true:
          console.log("active tab name speaker", this.speaker,);
          this.allSpeaker();
          break;
      }
    }, 2000); // 2000 milliseconds (2 seconds) delay
    });
  }

  unapproveSelected(): void {
    if (this.selectedUserIds.length === 0) {
      // Handle the case when no users are selected.
      this.SharedService.ToastPopup('',"please select record!" , 'error')

      return;
    }
    switch (true) {
      case this.delegate === true:
        console.log("active tab name delegate", this.delegate);
      this.form_name="delegate"
        break;
      case this.partner === true:
        console.log("active tab name partner", this.partner);
        this.form_name="partner"
        break;
      case this.speaker === true:
        console.log("active tab name speaker", this.speaker,);
        this.form_name="speaker"
  
        break;
    }
    // Prepare the payload with selected user IDs and status 0.
    const payload = {
      user_id: this.selectedUserIds.join(','), // Convert array to comma-separated string
      status: 2,      //unapprove
      updated_by: "admin",
      // user_name: this.userName,
      // user_email: this.userEmail,
      // company: this.company,
      // designation: this.designation,
      // urn_no:this.urn_no,
      // qr_code:this.qr_code,
      // user_number:this.user_number,
      user_name: this.selectedUserNames.join(','),
      user_email: this.selectedUserEmails.join(','),
      company:this.selectedCompanies.join(','),
      designation:  this.selectedDesignations.join(','),
      urn_no:this.selectedURNs.join(','),
      qr_code:this.selectedQRCodes.join('|'),
      user_number:this.selectedUserNumbers.join(','),
      form_name:this.form_name


    };

    console.log("active tab name delegate", this.delegate);
    console.log("active tab name partner", this.partner);
    console.log("active tab name speaker", this.speaker,);
    
    console.log("payload", payload);
    this.ngxService.start();
    this.AdminService.ApprovedUnapproveStatusRegistration(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', data.message, 'success');
      console.log(data.message);
      
 // Clear the selected arrays after successful unapprove
 this.selectedUserIds = [];
 this.selectedUserNames = [];
 this.selectedUserEmails = [];
 this.selectedCompanies = [];
 this.selectedDesignations = [];
 this.selectedURNs = [];
 this.selectedQRCodes = [];
 this.selectedUserNumbers = [];
      
      setTimeout(() => {
        this.router.navigate(['dashboard/non-registered-user']);
        this.selectAll = false;
        console.log("active tab name speaker", this.speaker);
        this.selectedUserIds = [];
        switch (true) {
          case this.delegate === true:
            console.log("active tab name delegate", this.delegate);
            this.allDelegate();
            break;
          case this.partner === true:
            console.log("active tab name partner", this.partner);
            this.allPartner();
            break;
          case this.speaker === true:
            console.log("active tab name speaker", this.speaker,);
            this.allSpeaker();
            break;
        }
    
      }, 2000); // 2000 milliseconds (2 seconds) delay
    })
  }
  toggleSelectAll() {
    // Toggle the selectAll variable
    this.selectAll = !this.selectAll;

    // If selectAll is true, add all user_ids to the selectedUserIds array
    console.log(this.selectAll);

    if (this.selectAll) {
      // this.selectedUserIds = this.nonregist.map(user => user.user_id.toString());
      this.selectedUserIds = this.nonregist.map(user => user.user_id);
      console.log(this.selectedUserIds);

    } else {
      // If selectAll is false, clear the AllselectedUserIds array
      this.selectedUserIds = [];
    }
  }

  updateAndUnapprovethroughDropdown(userId: number, userName: any, userEmail: any, company: any, designation: any,urn:any,qr_code:any,user_number:any): void {
    // Update the selected users
    this.updateSelectedUsers(userId, userName, userEmail, company, designation,urn,qr_code,user_number);

    // Now, call the unapproveSelected function
    this.unapproveSelected();
  }

  updateAndApprovethroughDropdown(userId: number, userName: any, userEmail: any, company: any, designation: any,urn:any,qr_code:any,user_number:any): void {
    // Update the selected users
    this.updateSelectedUsers(userId, userName, userEmail, company, designation,urn,qr_code,user_number);

    // Now, call the unapproveSelected function
    this.approveAndRegisterSelected();
  }
  deleteUser(userId: number, userName: any, userEmail: any, company: any, designation: any,urn:any,qr_code:any,user_number:any): void {
    this.updateSelectedUsers(userId, userName, userEmail, company, designation,urn,qr_code,user_number);
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
        this.router.navigate(['dashboard/non-registered-user']);
        switch (true) {
          case this.delegate === true:
            console.log("active tab name delegate", this.delegate);
            this.allDelegate();
            break;
          case this.partner === true:
            console.log("active tab name partner", this.partner);
            this.allPartner();
            break;
          case this.speaker === true:
            console.log("active tab name speaker", this.speaker,);
            this.allSpeaker();
            break;
        }
      }, 2000); // 2000 milliseconds (2 seconds) delay
    })
  }



  searchDelegateNonUser(): void {
    const searchValue = this.searchForm.get('searchInput').value;
    console.log("search called", searchValue, this.searchForm.get('searchInput').value);
    // Check if searchValue is an empty string
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
    this.AdminService.SearchDelegateNonUser(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', 'data fetched successfully', 'success')
      this.nonregist = data.data[0]
      if (this.nonregist.length === 0) {
        this.notFound = true;
        console.log("true");
        
      }
      else{
        this.notFound = false;
        console.log("false");
      }
      // setTimeout(() => {
      //   this.router.navigate(['dashboard/non-registered-user']);
      // }, 2000); // 2000 milliseconds (2 seconds) delay
    })
  }


  SearchPartnerNonUser(): void {
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
    this.AdminService.SearchPartnernNonUser(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', 'data fetched successfully', 'success')
      this.nonregist = data.data[0]
      if (this.nonregist.length === 0) {
        this.notFound = true;
      } else{
        this.notFound = false;
        console.log("false");
      }
      // setTimeout(() => {
      //   this.router.navigate(['dashboard/non-registered-user']);
      // }, 2000); // 2000 milliseconds (2 seconds) delay
    })
  }
  SearchSpeakerNonUser(): void {
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
    this.AdminService.SearchSpeakerNonUser(payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('', 'data fetched successfully', 'success')
      this.nonregist = data.data[0]
      console.log("array length", this.nonregist.length);
      if (this.nonregist.length === 0) {
        this.notFound = true;
      } else{
        this.notFound = false;
        console.log("false");
      }
      // setTimeout(() => {
      //   this.router.navigate(['dashboard/non-registered-user']);
      // }, 2000); // 2000 milliseconds (2 seconds) delay
    })
  }

  resetForm(): void {

    this.searchForm.reset();

    console.log("active tab name delegate",this.delegate);
    console.log("active tab name partner",this.partner);
    console.log("active tab name speaker",this.speaker,);
    switch (true) {
      case this.delegate === true:
        this.allDelegate();
        break;
      case this.partner === true:
        this.allPartner();
        break;
      case this.speaker === true:
        this.allSpeaker();
        break;
    }

  }
  searchUsers() {

    console.log("active tab name delegate", this.delegate);
    console.log("active tab name partner", this.partner);
    console.log("active tab name speaker", this.speaker,);

    switch (true) {
      case this.delegate === true:
        this.searchDelegateNonUser();
        break;
      case this.partner === true:
        this.SearchPartnerNonUser();
        break;
      case this.speaker === true:
        this.SearchSpeakerNonUser();
        break;
    }

  }
  // export() {
  //   switch (true) {
  //     case this.delegate === true:
  //       this.form="Delegate Form";
  //       break;
  //     case this.partner === true:
  //       this.form="Partner Form";
  //       break;
  //     case this.speaker === true:
  //       this.form="Speaker Form";
  //       break;
  //   }
  //   const options = {
  //     fieldSeparator: ',',
  //     quoteStrings: '"',
  //     decimalSeparator: '.',
  //     showLabels: true,
  //     showTitle: true,
  //     title: 'Non registered Users - '+this.form,
  //     useTextFile: false,
  //     useBom: true,
  //     headers: [
        
  //       'title',
  //       'first_name',
  //       'last_name',
  //       'department',
  //       'company_name',
  //       'designation',
  //       'mobile_number',
  //       'email_id',
  //       'website',
  //     ],
      
  //   };
    
  //   const csvExporter = new ExportToCsv(options);
  //   csvExporter.generateCsv(this.nonregist);
  
  //   this.SharedService.ToastPopup('Table has exported successfully', '', 'success');
  // }
  

  export() {
    switch (true) {
      case this.delegate === true:
        this.form = 'Delegates';
        break;
      case this.partner === true:
        this.form = 'Partners';
        break;
      case this.speaker === true:
        this.form = 'Speakers';
        break;
    }
  
 // Select the columns you want to export
 const columnsToExport = this.nonregist.map(item => {
  // Replace 'columnName' with the actual keys of the columns you want to export
  let modifiedRegistrationType = item.registration_type; // Initialize with the original value

  // Check if you want to change the 'registration_type' for specific items
  if (item.registration_type==="1") {
    // Modify 'registration_type' based on your condition
    modifiedRegistrationType = 'Delegate' /* Set the new value here */;
  } else if (item.registration_type==="2") {
    // Modify 'registration_type' based on your condition
    modifiedRegistrationType = 'Partner' /* Set the new value here */;
  }else{
    modifiedRegistrationType = 'Speaker' /* Set the new value here */;

  }
  let modifiedstatus = item.status; // Initialize with the original value
console.log(modifiedstatus==="1");
console.log(typeof modifiedstatus);

  if (item.status==="1") {
    // Modify 'registration_type' based on your condition
    modifiedstatus = 'Registered User' /* Set the new value here */;
  }else{
    modifiedstatus = 'Non-Registered User' /* Set the new value here */;

  }

  let created_date = this.datePipe.transform(item.created_date, 'yyyy-MM-dd hh:mm a');
let updated_date = this.datePipe.transform(item.updated_date, 'yyyy-MM-dd hh:mm a');
  return {
    'urn_no':  item.urn_no, 
    'registration_type': modifiedRegistrationType, // Use the modified value
    'title': item.title, 
    'first_name': item.first_name, 
    'last_name': item.last_name, 
    'department':  item.department, 
    'designation':  item.designation,
    'country_code':  item.country_code,
    'mobile_number':  item.mobile_number,  
    'email_id':  item.email_id, 
    'company_name':  item.company_name, 
    'company_address':  item.company_address, 
    'address_line_1':  item.address_line_1, 
    'address_line_2':  item.address_line_2, 
    'address_line_3':  item.address_line_3, 
    'country_name':  item.country_name, 
    'state_name':  item.state_name, 
    'city_name':  item.city_name, 
    'website':  item.website, 
    'conference_day':  item.conference_day, 
    'attending_purpose':  item.attending_purpose, 
    'specific_solution':  item.specific_solution, 
    'attended_innopack':  item.attended_innopack, 
    'is_active':  item.is_active, 
    'refrence_url':  item.refrence_url, 
    'refrence':  item.refrence, 
    'is_whatsapp_number':  item.is_whatsapp_number, 
    'terms_condition':  item.terms_condition, 
   'events':  item.events, 
   'created_date':created_date, 
   'updated_date':updated_date, 
   'status':  modifiedstatus, 
  };
});

const ws = XLSX.utils.json_to_sheet(columnsToExport);
    // const ws = XLSX.utils.json_to_sheet(this.nonregist);
    const wb = XLSX.utils.book_new();
     // Truncate the title if it exceeds 31 characters

    XLSX.utils.book_append_sheet(wb, ws,this.form);
  
    // You can set additional properties if needed, e.g., a title:
    wb.Props = {
      Title: 'Non registered Users - ' + this.form,
    };
  
    XLSX.writeFile(wb, 'Non_Registered_Users.xlsx');
  
    // Add your success message or any other functionality here.
    this.SharedService.ToastPopup('Table has exported successfully', '', 'success');

  }
  
}

