import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { OrderService } from 'src/app/services/order.service';
import { ValidateService } from 'src/app/services/validate.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

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
  note: boolean = false;
  sent: boolean = false;
  edit: boolean = false;
  add: boolean = true;

  constructor (
    private flashMessage: FlashMessagesService,
    private orderService: OrderService,
    private validateService: ValidateService,
    private router: Router
  ) {}

  ngOnInit (): void {
    this.orderService.getFishes().subscribe(
      data => {
        let arr = [];
        this.fishes = Object.keys(data).map(function (key) {
          arr.push({ [key]: data[key] });
          return arr;
        });
        this.fishes = this.fishes[0][0].fishes;
        for (let i = 0; i < this.fishes.length; i++) {
          this.fishes[i].amount = 0;
        }
      },
      e => {
        this.showErrors(e.error.msg || e.error.message);
      }
    );
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
    const order = {
      name: this.name,
      floor: this.floor,
      buildingNumber: this.building,
      phone: this.phone,
      region: this.region,
      appartmentNumber: this.appartment
    };
    // Validate name
    if (!this.validateService.validateName(order.name)) {
      this.showErrors('من فضلك ادخل اسمك بدون ارقام');
      return false;
    }

    // Validate phone
    if (!this.validateService.validatePhone(order.phone)) {
      this.showErrors('من فضلك ادخل رقم هاتف صحيح');
      return false;
    }

    // Validate building
    if (!this.validateService.validateNumber(order.buildingNumber)) {
      this.showErrors('من فضلك ادخل رقم العمارة بدون حروف');
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
  sendOrder () {
    for (var i = 0; i < this.fishes.length; i++) {
      if (this.fishes[i].amount > 0) {
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
  updatePrice (fish) {
    let value = $(`#${fish._id}`).val();
    fish.amount = value;
    if (value == '') value = 0;
    let trans = 50;
    if (this.region.includes('الهرم')) trans = 10;
    else if (this.region.includes('اكتوبر')) trans = 20;
    document.getElementById('total').innerHTML = trans.toString();
    this.note = true;
    $(`#note`).text(
      ' قيمة خدمة التوصليت الي ' + this.region + ' تساوي ' + trans
    );
    this.user.order.transports = trans;
    let sum = trans;
    for (let i = 0; i < this.fishes.length; i++) {
      sum += this.fishes[i].amount * this.fishes[i].price;
    }
    if (sum == trans) {
      document.getElementById('total').innerHTML = '0';
    } else {
      document.getElementById('total').innerHTML = sum.toString();
    }
  }
}
