import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.css']
})
export class CollaboratorComponent implements OnInit{

  collaborators: any[] = [];
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
      this.loadcollaborators();
    }
  
    loadcollaborators() {
      const payload = {
        page:this.page,
        limit:this.limit,
        sort:this.sortBy,
        order:this.order,
        search:this.search
      };
  
      this.ngxService.start();
  
      this.adminService.listCollaborator(payload).subscribe((res: any) => {
        this.ngxService.stop();
        this.collaborators = res.data;
        this.totalItems = res.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.limit);
  
      },
      (error: any) => {
        this.ngxService.stop();
        this.SharedService.ToastPopup('Oops failed to list collaborator', 'Collaborator', 'error');
      }
      )
    }

    onActivateDeactiveToggle(item:any):void{
      this.ngxService.start();
      const { id, created_at,updated_at, ...newItem } = item;
      item['is_active'] = +!item['is_active'];
      newItem['is_active'] = +!newItem['is_active'];
      this.updateCollaboratorData(item['id'],newItem);
    }

    updateCollaboratorData(id:string, payload:any){
      this.adminService.updateCollaborator(id,payload).subscribe((data: any) => {
        this.ngxService.stop();
        this.SharedService.ToastPopup('collaborator updated successfully', 'Collaborator', 'success');
      },
      (error: any) => {
        this.ngxService.stop();
        this.SharedService.ToastPopup('Oops failed to update collaborator', 'Collaborator', 'error');
      }
      )
    }

    onSelectionChange(selectedValue: string) {
      this.limit = +selectedValue;
      this.loadcollaborators();
    }
  
    onSearchClick(searchValue: string) {
      this.search = searchValue;
      this.loadcollaborators();
    }
  
    changePage(newPage: number) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.loadcollaborators();
      }
    }
  
    onSort(column: string) {
      this.sortBy = column;
      this.order = this.order === 'asc' ? 'desc' : 'asc';
      this.loadcollaborators();
    }

    downloadFile(item: any, isQR: boolean) {
      if(isQR){
        //download qr
        const qr_code_name = "qr.png";
        this.SharedService.downloadFile(item.qr_code_url,qr_code_name); //image
      }else{
        //download batch
        const badge_image_name = "badge_image.png";
        const badge_pdf_name = "badge_pdf.pdf";
        this.SharedService.downloadFile(item.badge_image_url,badge_image_name); //image
        this.SharedService.downloadFile(item.badge_pdf_url,badge_pdf_name); //pdf
      }
      
    }

    


}
