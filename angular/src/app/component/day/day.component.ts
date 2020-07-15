import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  daysData: any;
  edit: boolean = false;
  add: boolean = false;
  editRegion: boolean = false;
  addRegion: boolean = false;
  editRegionInfo: boolean = false;
  startDay: string;
  endDay: string;
  regions: any;
  dayId: String;
  regionId: String;
  search: String;
  transports: String;
  place: String;
  day: any;
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
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit (): void {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/home']);
    }
    this.adminService.getDays().subscribe(
      data => {
        let arr = [];
        this.daysData = Object.keys(data).map(function (key) {
          arr.push({ [key]: data[key] });
          return arr;
        });
        this.daysData = this.daysData[0][0].days;
        for (let i = 0; i < this.daysData.length; i++) {
          const s1 = new Date(this.daysData[i].from);
          const e1 = new Date(this.daysData[i].to);
          const s = this.formatDate(this.daysData[i].from);
          const e = this.formatDate(this.daysData[i].to);
          this.daysData[i].s = this.days[s1.getDay()] + ` (${s})`;
          this.daysData[i].e = this.days[e1.getDay()] + ` (${e})`;
        }
      },
      error => {
        this.showErrors(error.message || error.msg);
      }
    );
  }
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
  editDay (day) {
    this.dayId = day._id;
    this.day = day;
  }
  deleteDays () {
    let r = confirm('You are sure you want to delete this fish ?.');
    if (r) {
      this.adminService.deleteDays().subscribe(
        data => {
          this.daysData = [];
          this.showSuccess();
        },
        error => {
          this.showErrors(error.message || error.msg);
        }
      );
    }
  }
  deleteDay (day) {
    let r = confirm('You are sure you want to delete this fish ?.');
    if (r) {
      this.adminService.deleteDay(day).subscribe(
        data => {
          this.daysData.splice(this.daysData.indexOf(day), 1);
          this.showSuccess();
        },
        error => {
          this.showErrors(error.message || error.msg);
        }
      );
    }
  }
  editSaveDay () {
    if (this.edit || this.editRegion) {
      for (let i = 0; i < this.daysData.length; i++) {}
      this.adminService
        .editDay({
          _id: this.dayId,
          from: new Date(this.startDay),
          to: new Date(this.endDay),
          region: this.regions
        })
        .subscribe(
          data => {
            let arr = [];
            this.day = Object.keys(data).map(function (key) {
              arr.push({ [key]: data[key] });
              return arr;
            });

            this.day = this.day[0][0].day;
            const s1 = new Date(this.day.from);
            const e1 = new Date(this.day.to);
            const s = this.formatDate(this.day.from);
            const e = this.formatDate(this.day.to);
            this.day.s = this.days[s1.getDay()] + ` (${s})`;
            this.day.e = this.days[e1.getDay()] + ` (${e})`;

            for (let i = 0; i < this.daysData.length; i++) {
              const d = this.daysData[i];
              if (d._id == this.dayId) {
                this.daysData[i].from = this.day.from;
                this.daysData[i].to = this.day.to;
                this.daysData[i].s = this.day.s;
                this.daysData[i].e = this.day.e;
              }
            }
            this.day = undefined;
            this.dayId = undefined;
            this.showSuccess();
          },
          error => {
            this.showErrors(error.message || error.msg);
          }
        );
    } else if (this.add) {
      this.adminService
        .addDay({
          from: new Date(this.startDay),
          to: new Date(this.endDay)
        })
        .subscribe(
          data => {
            let arr = [];
            let d: any = Object.keys(data).map(function (key) {
              arr.push({ [key]: data[key] });
              return arr;
            });
            d = d[0][0].day;
            const s1 = new Date(d.from);
            const e1 = new Date(d.to);
            const s = this.formatDate(d.from);
            const e = this.formatDate(d.to);
            d.s = this.days[s1.getDay()] + ` (${s})`;
            d.e = this.days[e1.getDay()] + ` (${e})`;
            this.daysData.push(d);
            this.showSuccess();
            this.day = undefined;
            this.dayId = undefined;
          },
          error => {
            this.showErrors(error.message || error.msg);
          }
        );
    }
    this.edit = false;
    this.add = false;
  }
  formatDate (date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  editRegionData (day) {
    this.day = day;
    this.dayId = day._id;
    this.regions = this.day.region;
    console.log(day);
    this.edit = false;
    this.add = false;
  }
  eRegion () {
    let reg = {
      place: this.place,
      trans: this.transports
    };
    let dayObj = {
      _id: this.dayId,
      from: new Date(this.day.from),
      to: new Date(this.day.to),
      region: this.day.region
    };
    if (this.editRegionInfo) {
      for (let i = 0; i < this.regions.length; i++) {
        if (this.regions[i]._id == this.regionId) {
          this.regions[i].place = this.place;
          this.regions[i].trans = this.transports;
        }
      }
    } else if (this.addRegion) {
      dayObj.region.push(reg);
    }
    this.adminService.editDay(dayObj).subscribe(
      data => {
        this.showSuccess();
      },
      error => {
        this.showErrors(error.message || error.msg);
      }
    );
    this.transports = this.place = undefined;
  }
  RegionIdEdit (id) {
    this.regionId = id;
  }
  deleteRegion (region) {
    const index = this.day.region.indexOf(region);
    this.day.region.splice(index, 1);
    let dayObj = {
      _id: this.dayId,
      from: new Date(this.day.from),
      to: new Date(this.day.to),
      region: this.day.region
    };
    this.adminService.editDay(dayObj).subscribe(
      data => {
        this.showSuccess();
      },
      error => {
        this.showErrors(error.message || error.msg);
      }
    );
  }
  deleteRegions () {
    let dayObj = {
      _id: this.dayId,
      from: new Date(this.day.from),
      to: new Date(this.day.to),
      region: []
    };
    this.adminService.editDay(dayObj).subscribe(
      data => {
        this.regions = [];
        this.showSuccess();
        window.location.href = '/days';
      },
      error => {
        this.showErrors(error.message || error.msg);
      }
    );
  }
}
