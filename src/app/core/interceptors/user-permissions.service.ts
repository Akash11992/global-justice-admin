import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionsService {
  private superAdminEmails: string[] = ['admin@jlps.com']; // Add super admin emails here
  private supportTeamEmails: string[] = ['maneesh.yadav@cylsys.com']; // Add support team emails here

  constructor() { }

  getUserPermissions(email: string) {
    if (this.superAdminEmails.includes(email)) {
      return {
        create: true,
        view: true,
        update: true,
        delete: true,
      };
    } else if (this.supportTeamEmails.includes(email)) {
      return {
        create: true,
        view: true,
        update: false, // Support team cannot update
        delete: false, // Support team cannot delete
      };
    } else {
      return {
        create: false,
        view: false,
        update: false,
        delete: false,
      };
    }
  }
  
}
