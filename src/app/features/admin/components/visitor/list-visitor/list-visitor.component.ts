import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-visitor',
  templateUrl: './list-visitor.component.html',
  styleUrls: ['./list-visitor.component.css']
})

export class ListVisitorComponent implements OnInit{

  visitors: any[] = [];
  totalItems: number = 0;
  page: number = 1;
  limit: number = 25;
  sortBy: string = 'created_at';
  order: string = 'DESC';
  search: string = '';
  totalPages: number = 0;

  rowOptions = [
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ];

  filteredVisitors: any[] = []; // Filtered visitor data
  typeOptions: any[] = []; // Replace with your actual types
  selectedType: string = '';

  constructor(
                  private adminService: AdminService,
                  private ngxService: NgxUiLoaderService,
                  private SharedService: SharedService
                ) {}
  
    ngOnInit() {
      this.setupType();
      this.loadVisitors();
    }

    setupType(): void {
      this.adminService.listVisitorType().subscribe(
        (data: any) => {
          this.typeOptions = data['data'];
        },
        (error: any) => {
          console.log(error);
        }
      );
    }

    onClickExport(){
      const payload = {
        page:this.page,
        limit:this.limit,
        sort:this.sortBy,
        order:this.order,
        search:this.search,
        type:this.selectedType
      };
  
      this.ngxService.start();
  
      this.adminService.exportVisitor(payload).subscribe((blob: Blob) => {
        this.ngxService.stop();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `visitors_${new Date().toISOString().split('T')[0]}.csv`; // Set the file name
        link.click(); // Trigger the download
        window.URL.revokeObjectURL(link.href); 
      },
      (error: any) => {
        this.ngxService.stop();
        this.SharedService.ToastPopup('Oops failed to list visitor', 'Visitors', 'error');
      }
      )
    }
  
    loadVisitors() {
      const payload = {
        page:this.page,
        limit:this.limit,
        sort:this.sortBy,
        order:this.order,
        search:this.search,
        type:this.selectedType
      };
  
      this.ngxService.start();
  
      this.adminService.listVisitor(payload).subscribe((res: any) => {
        this.ngxService.stop();
        this.visitors = res.data;
        this.totalItems = res.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.limit);
  
      },
      (error: any) => {
        this.ngxService.stop();
        this.SharedService.ToastPopup('Oops failed to list visitor', 'Visitors', 'error');
      }
      )
    }

    onActivateDeactiveToggle(item:any):void{
      this.ngxService.start();
      const { id, created_at,updated_at, qr_unique_code,qr_code_url,...newItem } = item;
      item['is_active'] = +!item['is_active'];
      newItem['is_active'] = +!newItem['is_active'];
      newItem['domain_url'] = environment.domainUrl;
      newItem['logo_image'] = '';
      newItem['is_updated_by_activated'] = 1;
      this.updateVisitorData(item['id'],newItem);
    }

    updateVisitorData(id:string,data:any){
      this.adminService.deactivateVisitor(id,data).subscribe((data: any) => {
        this.ngxService.stop();
        this.SharedService.ToastPopup('Visitors updated successfully', 'Visitor', 'success');
      },
      (error: any) => {
        this.ngxService.stop();
        this.SharedService.ToastPopup('Oops failed to update visitor', 'Visitor', 'error');
      }
      )
    }

    onSelectionChange(selectedValue: string) {
      this.limit = +selectedValue;
      this.loadVisitors();
    }

    onTypeFilterChange(type: string): void {
      this.selectedType = type;
      this.loadVisitors();
    }
  
    onSearchClick(searchValue: string) {
      this.search = searchValue ? searchValue.trim() : "";
      this.loadVisitors();
    }
  
    changePage(newPage: number) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.loadVisitors();
      }
    }
  
    onSort(column: string): void {

      if (this.sortBy === column) {
        // If the column is already sorted, toggle the direction
        this.order = this.order === 'ASC' ? 'DESC' : 'ASC';
      } else {
        // Otherwise, sort by the new column in ascending order by default
        this.sortBy = column;
        this.order = 'ASC';
      }

      // Implement actual sorting logic here
      this.loadVisitors();
  
    }

    downloadFile(filePath: string, fileName: string,fileType:string) {
      switch(fileType){
        case 'QR':
        filePath = environment.fileAccessUrl+'/visitor/qr/'+fileName;
        break;

        case 'BADGE_IMG':
          filePath = environment.fileAccessUrl+'/visitor/batch/image/'+fileName;
        break;

        case 'BADGE_PDF':
          filePath = environment.fileAccessUrl+'/visitor/batch/pdf/'+fileName;
        break;

      }
      this.SharedService.downloadFile(filePath, fileName);
    }
  
}
