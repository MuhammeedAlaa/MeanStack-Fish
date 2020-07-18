import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from 'src/app/services/validate.service';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  admins: any;
  edit: boolean = false;
  name: String;
  email: String;
  phone: String;
  userId: String;
  image: any;
  constructor (
    private flashMessage: FlashMessagesService,
    private validateService: ValidateService,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}
  async showSuccess () {
    await this.flashMessage.show('Success', {
      cssClass: 'alert-success',
      timeout: 3000
    });
  }

  async showErrors (errorMessage) {
    await this.flashMessage.show(errorMessage, {
      cssClass: 'alert-danger',
      timeout: 6000
    });
    if (errorMessage == 'Your token has expired! Please log in again.') {
      this.authService.logout();
    }
  }

  ngOnInit (): void {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/home']);
    }
    this.adminService.getAdmins().subscribe(
      data => {
        this.admins = data;
      },
      error => {
        this.showErrors(error.message || error.msg);
      }
    );
  }
  editUser () {
    const formData = new FormData();
    formData.append('file', this.image);
    const user = {
      name: this.name,
      phone: this.phone,
      email: this.email
    };
    formData.append('user', JSON.stringify(user));

    // Required fields
    if (!this.validateService.validateEdit(user)) {
      this.showErrors('Please fill in all fields');
      return false;
    }

    // Validate email
    if (!this.validateService.validateEmail(user.email)) {
      this.showErrors('Please enter a valid email');
      return false;
    }
    // Validate phone
    if (!this.validateService.validatePhone(user.phone)) {
      this.showErrors('the number you entered is not a valid number');
      return false;
    }

    this.adminService.editAdmin(formData).subscribe(
      data => {
        let s = JSON.stringify(data);
        this.userId = s.substring(8, s.indexOf(',"email"') - 1);
        for (let i = 0; i < this.admins.length; i++) {
          let admin = this.admins[i];
          if (admin._id == this.userId) {
            this.admins[i].email = this.email;
            this.admins[i].name = this.name;
            this.admins[i].phone = this.phone;
            localStorage.removeItem('name');
            localStorage.setItem('name', <string>this.name);
          }
        }
        this.showSuccess();
      },
      error => {
        this.showErrors(error.message || error.msg);
      }
    );
  }
  selectImage (event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }
}
