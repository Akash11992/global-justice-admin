import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-sponsorship',
  templateUrl: './sponsorship.component.html',
  styleUrls: ['./sponsorship.component.css']
})
export class SponsorshipComponent implements OnInit {

  sponsorships: any[] = [];
  totalItems: number = 0;
  page: number = 1;
  limit: number = 25;
  sortBy: string = 'created_at';
  order: string = 'desc';
  search: string = '';
  totalPages: number = 0;

  rowOptions = [
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ];


   constructor(
                private adminService: AdminService,
                private ngxService: NgxUiLoaderService,
                private SharedService: SharedService
              ) {}

  ngOnInit() {
    this.loadSponsorships();
  }

  loadSponsorships() {
    const payload = {
      page:this.page,
      limit:this.limit,
      sort:this.sortBy,
      order:this.order,
      search:this.search
    };

    this.ngxService.start();

    this.adminService.listSponsorship(payload).subscribe((res: any) => {
      this.ngxService.stop();
      this.sponsorships = res.data;
      this.totalItems = res.totalItems;
      this.totalPages = Math.ceil(this.totalItems / this.limit);

    },
    (error: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('Oops failed to list sponsorship', 'Sponsorship', 'error');
    }
    )
  }

  onActivateDeactiveToggle(item:any):void{
    this.ngxService.start();
    const { id, created_at,updated_at, ...newItem } = item;
    item['is_active'] = +!item['is_active'];
    newItem['is_active'] = +!newItem['is_active'];
    this.updateSponsorshipData(item['id'],newItem);
  }

  updateSponsorshipData(id:string, payload:any){
    this.adminService.updateSponsorship(id,payload).subscribe((data: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('Sponsorship updated successfully', 'Sponsorship', 'success');
    },
    (error: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('Oops failed to update sponsorship', 'Sponsorship', 'error');
    }
    )
  }

  onSelectionChange(selectedValue: string) {
    this.limit = +selectedValue;
    this.loadSponsorships();
  }

  onSearchClick(searchValue: string) {
    this.search = searchValue;
    this.loadSponsorships();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadSponsorships();
    }
  }


  onSort(column: string) {
    this.sortBy = column;
    this.order = this.order === 'asc' ? 'desc' : 'asc';
    this.loadSponsorships();
  }
}

