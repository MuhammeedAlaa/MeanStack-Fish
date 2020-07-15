import { Component, OnInit } from '@angular/core';
import { FishService } from 'src/app/services/fish.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.css']
})
export class AmountComponent implements OnInit {
  search: String;
  fishes: any;
  public days = [
    'اﻷحد',
    'اﻷثنين',
    'الثلاثاء',
    'اﻷربعاء',
    'الخميس',
    'الجمعة',
    'السبت'
  ];
  constructor (
    private flashMessage: FlashMessagesService,
    private fishService: FishService,
    private authService: AuthService,
    private router: Router
  ) {}
  formatDate (date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  ngOnInit (): void {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/home']);
    }
    this.fishService.getAmounts().subscribe(
      data => {
        let arr = [];
        this.fishes = Object.keys(data).map(function (key) {
          arr.push({ [key]: data[key] });
          return arr;
        });
        this.fishes = this.fishes[0][0].result;

        for (let i = 0; i < this.fishes.length; i++) {
          const ele1 = new Date(this.fishes[i].day);
          const ele = this.formatDate(this.fishes[i].day);
          this.fishes[i].d = this.days[ele1.getDay()] + ` (${ele})`;
        }
      },
      error => {
        this.showErrors(error.message || error.msg);
      }
    );
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
}
