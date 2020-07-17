import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DatePipe]
})
export class NavbarComponent implements OnInit {
  name: string;
  constructor (
    private router: Router,
    private flashMessage: FlashMessagesService,
    public _authService: AuthService,
    public admin: AdminService,
    private datePipe: DatePipe
  ) {}
  notification: any;
  ngOnInit (): void {
    this.name = localStorage.getItem('name');
    if (this._authService.loggedIn())
      this.admin.getAdminNotifications().subscribe(
        data => {
          let arr = [];
          this.notification = Object.keys(data).map(function (key) {
            arr.push({ [key]: data[key] });
            return arr;
          });
          if (this.notification[0][0].notifications != null) {
            this.notification = [];
          } else
            this.notification = this.notification[0][0].notifications.items;
          for (let index = 0; index < this.notification.length; index++) {
            this.notification[index].data = JSON.parse(
              this.notification[index].data.data
            );
            this.notification[index].date = this.datePipe.transform(
              this.notification[index].date
            );
          }
        },
        error => {
          this.flashMessage.show(error.message, {
            cssClass: 'alert-danger',
            timeout: 3000
          });
        }
      );
  }

  onLogout () {
    this._authService.logout();

    this.flashMessage.show('You are logged out', {
      cssClass: 'alert-success',
      timeout: 3000
    });
    this.router.navigate(['/home']);
  }
}
