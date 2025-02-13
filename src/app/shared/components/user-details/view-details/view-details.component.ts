import { Component } from '@angular/core';
import { AdminService } from 'src/app/features/admin/services/admin.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent {
  refer:any;
  getdata: any;
  is_registered_user:boolean=true;
country_codemb:any;
  constructor( private AdminService: AdminService,private SharedService: SharedService,private route: ActivatedRoute)
{

}


ngOnInit(): void {
  
  this.getUserByid();
}
getUserByid() {
    
   // Use ActivatedRoute to get the user_id parameter from the route
  this.route.params.subscribe(params => {
    const user_id = params['user_id'];
    if (user_id) {
      let payload = { user_id: user_id }; // Set the user_id in your payload
      this.AdminService.getUserByid(payload).subscribe((data: any) => {
        // console.log("data", data.data);
        if (data && data.data !== undefined) {
          this.getdata = data.data[0][0];
          console.log("getbyid",this.getdata);
          let a=this.getdata.country_code
          console.log("code",a);
      // Use a regular expression to extract the country code (+93)
  const CodeMatch = a.match(/\+(\d+)/);
    console.log(CodeMatch[0]);
    this.country_codemb=CodeMatch[0];
    
        }
      }, (err) => {
        console.error('Fetching operation failed:', err);
      });
    }
  });
  
this.route.queryParams.subscribe(queryParams => {
  this.refer = queryParams['refer'];
  console.log("........page...",this.refer);
  
  if (this.refer==='non-registered-user') {
    console.log(".....true");
    
    this.is_registered_user=false;
  }
});
}

}

