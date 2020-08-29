import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { OrderService } from 'src/app/services/order.service';
import { ValidateService } from 'src/app/services/validate.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  name: String;
  phone: String;
  region: String;
  building: String;
  floor: String;
  search: String;
  appartment: String;
  amount: String;
  placeholder: String = 'ادخل';
  user: any;
  fishes: any;
  fishesOrder: any;
  note: boolean = false;
  sent: boolean = false;
  edit: boolean = false;
  add: boolean = true;
  regions: any;
  dayObj: any;
  place: String;
  trans: string;
  private days = [
    'اﻷحد',
    'اﻷثنين',
    'الثلاثاء',
    'اﻷربعاء',
    'الخميس',
    'الجمعة',
    'السبت'
  ];
  private numbers = new Map();
  constructor (
    private flashMessage: FlashMessagesService,
    private orderService: OrderService,
    private validateService: ValidateService,
    private router: Router,
    private authService: AuthService
  ) {
    this.numbers.set('٠', '0');
    this.numbers.set('١', '1');
    this.numbers.set('٢', '2');
    this.numbers.set('٣', '3');
    this.numbers.set('٤', '4');
    this.numbers.set('٥', '5');
    this.numbers.set('٦', '6');
    this.numbers.set('٧', '7');
    this.numbers.set('٨', '8');
    this.numbers.set('٩', '9');
    this.numbers.set('٫', '.');
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
  ngOnInit (): void {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/home']);
    }
    this.orderService.getDays().subscribe(
      data => {
        let arr = [];
        this.regions = Object.keys(data).map(function (key) {
          arr.push({ [key]: data[key] });
          return arr;
        });
        this.regions = this.regions[0][0].days;
        let j = 0;
        while (j < this.regions.length) {
          const end = new Date(this.regions[j].to);
          const now = new Date();
          if (end < now) {
            this.regions.splice(j, 1);
          } else j++;
        }
        for (let i = 0; i < this.regions.length; i++) {
          const ele1 = new Date(this.regions[i].from);
          const ele = this.formatDate(this.regions[i].from);
          this.regions[i].fromDay = this.days[ele1.getDay()] + ` (${ele})`;
        }
      },
      e => {
        this.showErrors(e.error.msg || e.error.message);
      }
    );
    this.orderService.getFishes().subscribe(
      data => {
        let arr = [];
        this.fishesOrder = Object.keys(data).map(function (key) {
          arr.push({ [key]: data[key] });
          return arr;
        });
        this.fishesOrder = this.fishesOrder[0][0].fishes;
        for (let i = 0; i < this.fishesOrder.length; i++) {
          this.fishesOrder[i].amount = 0;
        }
      },
      e => {
        this.showErrors(e.error.msg || e.error.message);
      }
    );
  }
  setDay () {
    let id = $('#day').val();
    if (id == '') {
      this.dayObj = undefined;
    } else
      for (let index = 0; index < this.regions.length; index++) {
        if (id == this.regions[index].fromDay)
          this.dayObj = this.regions[index];
      }
  }
  setRegion () {
    let id = $('#editRegion').val();
    if (id == '') {
      this.region = undefined;
      this.trans = undefined;
    } else
      for (let index = 0; index < this.dayObj.region.length; index++) {
        if (id == this.dayObj.region[index].place)
          (this.region = this.dayObj.region[index].place),
            (this.trans = this.dayObj.region[index].trans);
      }
  }
  async showSuccess () {
    await this.flashMessage.show('تم بنجاح', {
      cssClass: 'alert-success',
      timeout: 3000
    });
  }

  async showErrors (errorMessage) {
    await this.flashMessage.show(errorMessage, {
      cssClass: 'alert-danger',
      timeout: 6000
    });
  }
  onSubmit () {
    this.fishes = [];
    for (let i = 0; i < this.fishesOrder.length; i++) {
      if (this.fishesOrder[i].day == this.dayObj.from)
        this.fishes.push(this.fishesOrder[i]);
    }
    const order = {
      name: this.name,
      floor: this.floor,
      buildingNumber: this.building,
      phone: this.phone,
      region: this.region,
      appartmentNumber: this.appartment,
      transports: this.trans,
      day: this.dayObj.from
    };
    // Validate name
    if (!this.validateService.validateName(order.name)) {
      this.showErrors('من فضلك ادخل اسمك ثنائي بدون ارقام');
      return false;
    }

    // Validate phone
    if (!this.validateService.validatePhone(order.phone)) {
      this.showErrors('من فضلك ادخل رقم هاتف صحيح');
      return false;
    }

    // Validate floor
    if (!this.validateService.validateNumber(order.floor)) {
      this.showErrors('من فضلك ادخل الدور بدون حروف');
      return false;
    }

    // Validate appartment
    if (!this.validateService.validateNumber(order.appartmentNumber)) {
      this.showErrors('من فضلك ادخل رقم الشقه بدون حروف');
      return false;
    }
    if (this.edit) {
      this.edit = false;
      this.orderService
        .editOrderInfo({ ...order, _id: this.user.order._id })
        .subscribe(
          data => {
            this.user = data;
            this.showSuccess();
          },
          e => {
            this.showErrors(e.error.msg || e.error.message);
          }
        );
    } else if (this.add) {
      this.add = false;
      this.orderService.sendOrderInfo(order).subscribe(
        data => {
          this.user = data;
          this.showSuccess();
        },
        e => {
          this.showErrors(e.error.msg || e.error.message);
        }
      );
    }
  }
  arabictonum (arabicnumstr) {
    let num = '';
    for (let i = 0; i < arabicnumstr.length; i++) {
      console.log(this.numbers.get(arabicnumstr));

      num += this.numbers.get(arabicnumstr[i]);
    }
    return num;
  }
  sendOrder () {
    this.user.order.Fishes = [];
    for (var i = 0; i < this.fishes.length; i++) {
      if (this.fishes[i].amount > 0) {
        if (/^[\u0660-\u0669]{1,}$/.test(this.fishes[i].amount))
          this.fishes[i].amount = this.arabictonum(this.fishes[i].amount);
        this.user.order.Fishes.push({
          Fish: this.fishes[i]._id,
          amount: this.fishes[i].amount
        });
      }
    }
    this.orderService.sendOrder(this.user.order).subscribe(
      data => {
        this.showSuccess();
        document.getElementById('sendOrder').innerHTML =
          'ارسال الاوردر بعد التعديل';
        this.sent = true;
      },
      e => {
        this.showErrors(e.error.msg || e.error.message);
      }
    );
  }
  deleteOrder () {
    let r = confirm('يرجي التاكيد علي مسح الاوردر');
    if (r) {
      this.sent = false;
      this.orderService.deleteOrder(this.user.order._id).subscribe(
        data => {
          this.showSuccess();
          window.location.href = '/';
        },
        e => {
          this.showErrors(e.error.msg || e.error.message);
        }
      );
    }
  }
  updatePrice (fish) {
    let value = $(`#${fish._id}`).val();
    fish.amount = value;
    if (value == '') value = 0;

    document.getElementById('total').innerHTML = this.trans.toString();
    this.note = true;
    $(`#note`).text(
      ' قيمة خدمة التوصيل الي ' + this.region + ' تساوي ' + this.trans
    );
    this.user.order.transports = this.trans;
    let sum = parseFloat(this.trans);
    for (let i = 0; i < this.fishes.length; i++) {
      sum += this.fishes[i].amount * this.fishes[i].price;
    }
    if (sum == parseFloat(this.trans)) {
      document.getElementById('total').innerHTML = '0';
    } else {
      document.getElementById('total').innerHTML = sum.toString();
    }
  }
}
