import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  orders: any;
  search: String;
  recipt: boolean = false;
  constructor (
    private flashMessage: FlashMessagesService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

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
  ngOnInit (): void {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/home']);
    }
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
          this.orders.push({
            name: pages[i].name,
            floor: pages[i].floor,
            buildingNumber: pages[i].buildingNumber,
            phone: pages[i].phone,
            region: pages[i].region,
            appartmentNumber: pages[i].appartmentNumber,
            _id: pages[i].id,
            number: pages[i].number,
            fishes: [],
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
        for (let j = 0; j < this.orders.length - 1; j++) {
          const order = this.orders[j];
          if (order._id == this.orders[j + 1]._id) {
            this.orders.splice(j, 1);
          }
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
        console.log(this.orders);
      },
      e => {
        this.showErrors(e.error.msg || e.error.message);
      }
    );
  }
}
