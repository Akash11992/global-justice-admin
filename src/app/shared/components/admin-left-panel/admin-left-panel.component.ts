import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPermissionsService } from 'src/app/core/interceptors/user-permissions.service';


@Component({
  selector: 'app-admin-left-panel',
  templateUrl: './admin-left-panel.component.html',
  styleUrls: ['./admin-left-panel.component.css']
})
export class AdminLeftPanelComponent implements OnInit {
  userPermissions: any;

  constructor(private router: Router,
    private permissionsService: UserPermissionsService

  ) {}
  ngOnInit(): void {
    this.getUserPermission();
  }

  confirmLogout() {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      this.router.navigate(['/login']);
    }
  }

  async getUserPermission() {
    let userData = JSON.parse(localStorage.getItem('userDetails'));
    this.permissionsService.getUserPermissions(userData.email);

    // Use in-memory permissions instead of localStorage to prevent tampering
    this.userPermissions = this.permissionsService.getStoredPermissions();
  }
}
