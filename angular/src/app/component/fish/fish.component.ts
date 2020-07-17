import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { FishService } from 'src/app/services/fish.service';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-fish',
  templateUrl: './fish.component.html',
  styleUrls: ['./fish.component.css']
})
export class FishComponent implements OnInit {
  fishes: any;
  edit: boolean = false;
  add: boolean = false;
  type: String;
  fishId: String;
  price: String;
  search: String;
  day: Date;
  daysData: any;
  image: any;
  public days = [
    'اﻷحد',
    'اﻷثنين',
    'الثلاثاء',
    'اﻷربعاء',
    'الخميس',
    'الجمعة',
    'السبت'
  ];
  placeholder: String;
  constructor (
    private flashMessage: FlashMessagesService,
    private fishService: FishService,
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService
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
    this.orderService.getDays().subscribe(
      data => {
        let arr = [];
        this.daysData = Object.keys(data).map(function (key) {
          arr.push({ [key]: data[key] });
          return arr;
        });
        this.daysData = this.daysData[0][0].days;
        for (let i = 0; i < this.daysData.length; i++) {
          const ele1 = new Date(this.daysData[i].from);
          const ele = this.formatDate(this.daysData[i].from);
          this.daysData[i].fromDay = this.days[ele1.getDay()] + ` (${ele})`;
        }
      },
      error => {
        this.showErrors(error.message || error.msg);
      }
    );
    this.fishService.getFishes().subscribe(
      data => {
        let s = JSON.stringify(data);
        this.fishes = JSON.parse(
          s.substring(s.indexOf('['), s.indexOf(']') + 1)
        );
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
  setDay () {
    let id = $('#list').val();
    if (id == '') {
      this.day = undefined;
    } else
      for (let index = 0; index < this.daysData.length; index++) {
        if (id == this.daysData[index].fromDay)
          this.day = this.daysData[index].from;
      }
  }
  async showSuccess () {
    await this.flashMessage.show('Success', {
      cssClass: 'alert-success',
      timeout: 3000
    });
  }
  selectImage (event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
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
  editFish (fish) {
    this.fishId = fish._id;
  }
  deleteFishes () {
    let r = confirm('You are sure you want to delete this fish ?.');
    if (r) {
      this.fishService.deleteFishes().subscribe(
        data => {
          this.fishes = [];
          this.showSuccess();
        },
        error => {
          this.showErrors(error.message || error.msg);
        }
      );
    }
  }
  deleteFish (fish) {
    let r = confirm('You are sure you want to delete this fish ?.');
    if (r) {
      this.fishService.deleteFish(fish).subscribe(
        data => {
          this.fishes.splice(this.fishes.indexOf(fish), 1);

          this.showSuccess();
        },
        error => {
          this.showErrors(error.message || error.msg);
        }
      );
    }
  }
  editSaveFish () {
    if (this.edit) {
      const formData = new FormData();
      formData.append('file', this.image);
      const fish = {
        _id: this.fishId,
        type: this.type,
        price: this.price,
        day: new Date(this.day)
      };
      formData.append('fish', JSON.stringify(fish));
      this.fishService.editFish(formData, fish._id).subscribe(
        data => {
          let s = JSON.stringify(data);
          let edited = JSON.parse(
            s.substring(s.indexOf('{"imgUrl"'), s.indexOf('}}') + 1)
          );
          this.fishId = edited._id;
          for (let i = 0; i < this.fishes.length; i++) {
            const fish = this.fishes[i];
            if (fish._id == this.fishId) {
              this.fishes[i].type = edited.type;
              this.fishes[i].price = edited.price;
              this.fishes[i].imgUrl = edited.imgUrl;
            }
          }
          this.showSuccess();
        },
        error => {
          this.showErrors(error.message || error.msg);
        }
      );
    } else if (this.add) {
      const formData = new FormData();
      formData.append('file', this.image);
      const fish = {
        type: this.type,
        price: this.price,
        day: new Date(this.day)
      };
      formData.append('fish', JSON.stringify(fish));
      this.fishService.addFish(formData).subscribe(
        data => {
          let s = JSON.stringify(data);
          this.fishes.push(
            JSON.parse(s.substring(s.indexOf('{"imgUrl"'), s.indexOf('}}') + 1))
          );
          const ele1 = new Date(this.fishes[this.fishes.length - 1].day);

          const ele = this.formatDate(this.fishes[this.fishes.length - 1].day);
          this.fishes[this.fishes.length - 1].d =
            this.days[ele1.getDay()] + ` (${ele})`;

          this.showSuccess();
        },
        error => {
          this.showErrors(error.message || error.msg);
        }
      );
    }
    this.edit = false;
    this.add = false;
  }
}
