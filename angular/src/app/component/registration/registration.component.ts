import { Component, OnInit } from '@angular/core';
import { ValidateService } from 'src/app/services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  name: string;
  password: string;
  passwordConfirm: string;
  email: string;
  phone: string;
  userPassword: string;
  data: any;

  constructor (
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit (): void {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  showSuccess () {
    this.flashMessage.show('Success', {
      cssClass: 'alert-success',
      timeout: 3000
    });
  }

  showErrors (errorMessage) {
    this.flashMessage.show(errorMessage, {
      cssClass: 'alert-danger',
      timeout: 6000
    });
    if (errorMessage == 'Your token has expired! Please log in again.') {
      this.authService.logout();
    }
  }

  registerAdmin () {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
      phone: this.phone,
      userPassword: this.userPassword
    };

    // Required fields
    if (!this.validateService.validateRegister(user)) {
      this.showErrors('Please fill in all fields');
      return false;
    }

    // Validate email
    if (!this.validateService.validateEmail(user.email)) {
      this.showErrors('Please enter a valid email');
      return false;
    }

    // Validate password
    if (!this.validateService.validatePassword(user.password)) {
      this.showErrors(
        'password must be at least 8 characters of letters and numbers'
      );
      return false;
    }
    // Validate phone
    if (!this.validateService.validatePhone(user.phone)) {
      this.showErrors('the number you entered is not a valid number');
      return false;
    }

    // Validate password confirm
    if (
      !this.validateService.validatePasswordConfirm(
        user.password,
        user.passwordConfirm
      )
    ) {
      this.showErrors('password and password confirm do not match');
      return false;
    }

    // Register user
    this.authService.sendRegistrationUserRequest(user).subscribe(
      data => {
        this.data = data;
        this.showSuccess();
        this.router.navigate(['/']);
      },
      e => {
        this.showErrors(e.error.msg || e.error.message);
        this.router.navigate(['/registration']);
      }
    );
  }
}
