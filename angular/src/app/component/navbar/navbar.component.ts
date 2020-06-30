import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  name: string;
  constructor (
    private router: Router,
    private flashMessage: FlashMessagesService,
    public _authService: AuthService
  ) {
    this.name = localStorage.getItem('name');
  }

  ngOnInit (): void {}

  onLogout () {
    this._authService.logout();

    this.flashMessage.show('You are logged out', {
      cssClass: 'alert-success',
      timeout: 3000
    });
    this.router.navigate(['/home']);
  }
}
