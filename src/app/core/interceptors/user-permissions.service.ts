import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionsService {
  private userPermission: any = {};
  private superAdminEmails: string[] = ['admin@jlps.com']; // Add super admin emails here
  private supportTeamEmails: string[] = ['support@jlps.com']; // Add support team emails here

  constructor() { }

  getUserPermissions(email: string) {
    if (this.superAdminEmails.includes(email)) {
      this.userPermission = {
        create: true,
        view: true,
        update: true,
        delete: true,
      };

    } else if (this.supportTeamEmails.includes(email)) {

      this.userPermission = {
        create: true,
        view: true,
        update: false, // Support team cannot update
        delete: false, // Support team cannot delete
      };

    } else {
      this.userPermission = {
        create: false,
        view: true,
        update: false,
        delete: false,
      };
    }
    // Store general user permissions
    localStorage.setItem('userPermission', JSON.stringify(this.userPermission));

  }

  getStoredPermissions() {
    // Return permissions from in-memory, preventing modification via localStorage
    return this.userPermission;
  }
}
