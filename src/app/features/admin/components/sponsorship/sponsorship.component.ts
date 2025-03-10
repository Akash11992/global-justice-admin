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
      this.SharedService.ToastPopup('Oops failed to list sponsor', 'Sponsor', 'error');
    }
    )
  }

  onClickExport(){
    const payload = {
      page:this.page,
      limit:this.limit,
      sort:this.sortBy,
      order:this.order,
      search:this.search
    };

    this.ngxService.start();

    this.adminService.exportSponsor(payload).subscribe((blob: Blob) => {
      this.ngxService.stop();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `sponsor_${new Date().toISOString().split('T')[0]}.csv`; // Set the file name
      link.click(); // Trigger the download
      window.URL.revokeObjectURL(link.href); 
    },
    (error: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('Oops failed to list sponsor', 'Sponsors', 'error');
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
      this.SharedService.ToastPopup('Sponsor updated successfully', 'Sponsor', 'success');
    },
    (error: any) => {
      this.ngxService.stop();
      this.SharedService.ToastPopup('Oops failed to update sponsor', 'Sponsor', 'error');
    }
    )
  }

  onSelectionChange(selectedValue: string) {
    this.limit = +selectedValue;
    this.loadSponsorships();
  }

  onSearchClick(searchValue: string) {
    this.search = searchValue ? searchValue.trim() : "";
    this.loadSponsorships();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadSponsorships();
    }
  }


  onSort(column: string): void{
    if (this.sortBy === column) {
      // Toggle the sorting direction
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      // Sort by the new column in ascending order
      this.sortBy = column;
      this.order = 'asc';
    }
    this.loadSponsorships();
  }
}

