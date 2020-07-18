import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe } from '@angular/common';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [DatePipe]
})
export class UserComponent implements OnInit {
  orders: any;
  user: any;
  search: String;
  recipt: boolean = false;
  id: any;
  private days = [
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
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
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

  showSuccess () {
    this.flashMessage.show('Success', {
      cssClass: 'alert-success',
      timeout: 6000
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
  sendOrder () {
    this.userService.sendOrders(this.user._id).subscribe(
      data => {
        this.showSuccess();
        let arr: any = [];
        arr = Object.keys(data).map(key => {
          arr.push({ [key]: data[key] });
          return arr;
        });
        this.user.sent = arr[0][0].order.sent;
        this.user.sender = arr[0][0].order.sender;
      },
      e => {
        this.showErrors(e.error.msg || e.error.message);
      }
    );
  }
  download () {
    let element = document.getElementById('pdf');
    html2canvas(element).then(canvas => {
      let img = canvas.toDataURL('image/png');
      let doc = new jspdf('p', 'mm', 'a4');
      doc.addImage(img, 'PNG', 0, 10, 200, 330);
      doc.save(`recipt_${this.user.name}.pdf`);
      this.showSuccess();
      window.location.href = '/users';
    });
  }

  ngOnInit (): void {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/home']);
    }

    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    if (localStorage.getItem('notificationToken') != undefined)
      this.authService.sendTokenToServer().subscribe(
        data => {},
        e => {
          this.showErrors(e.error.msg || e.error.message);
        }
      );
    this.userService.getOrders().subscribe(
      data => {
        let arr = [];
        this.orders = Object.keys(data).map(function (key) {
          arr.push({ [key]: data[key] });
          return arr;
        });
        let pages = this.orders[0][0].page;
        this.orders = [];
        let fishes = [];
        for (let i = 0; i < pages.length; i++) {
          const ele1 = new Date(pages[i].day);
          const ele = this.formatDate(pages[i].day);
          this.orders.push({
            name: pages[i].name,
            floor: pages[i].floor,
            buildingNumber: pages[i].buildingNumber,
            phone: pages[i].phone,
            region: pages[i].region,
            appartmentNumber: pages[i].appartmentNumber,
            transports: pages[i].transports,
            _id: pages[i].id,
            number: pages[i].number,
            fishes: [],
            sender: pages[i].sender,
            sent: pages[i].sent,
            day: pages[i].day,
            d: this.days[ele1.getDay()] + ` (${ele})`,
            total: 0
          });
          fishes.push({
            _id: pages[i].id,
            type: pages[i].type,
            price: pages[i].price,
            fishId: pages[i].fishId,
            amount: pages[i].amount
          });
        }
        let j = 0;
        while (j < this.orders.length - 1) {
          const order = this.orders[j];
          if (order._id == this.orders[j + 1]._id) {
            this.orders.splice(j, 1);
          } else j++;
        }
        for (let k = 0; k < fishes.length; k++) {
          const fish = fishes[k];
          for (let l = 0; l < this.orders.length; l++) {
            const order = this.orders[l];
            if (order._id == fish._id) {
              this.orders[l].fishes.push({
                type: fish.type,
                price: fish.price,
                fishId: fish.fishId,
                amount: fish.amount
              });
              this.orders[l].total += fish.amount * fish.price;
            }
          }
        }
        for (let index = 0; index < this.orders.length; index++) {
          this.orders[index].total += parseInt(this.orders[index].transports);
          this.orders[index].data = this.datePipe.transform(new Date());
          if (this.orders[index]._id == this.id) {
            this.user = this.orders[index];
          }
        }
        console.log(this.orders);

        if (this.user) {
          this.recipt = true;
        }
      },
      e => {
        this.showErrors(e.error.msg || e.error.message);
      }
    );
  }
}
