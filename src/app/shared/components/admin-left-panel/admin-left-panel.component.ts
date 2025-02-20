import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-left-panel',
  templateUrl: './admin-left-panel.component.html',
  styleUrls: ['./admin-left-panel.component.css']
})
export class AdminLeftPanelComponent {
  constructor(private router: Router) {}

  confirmLogout() {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      this.router.navigate(['/login']);
    }
  }

}
