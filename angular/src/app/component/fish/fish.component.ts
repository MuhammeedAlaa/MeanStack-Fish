import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { FishService } from 'src/app/services/fish.service';
import { Router } from '@angular/router';

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
  placeholder: String;
  constructor (
    private flashMessage: FlashMessagesService,
    private fishService: FishService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit (): void {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/home']);
    }
    this.fishService.getFishes().subscribe(
      data => {
        let s = JSON.stringify(data);
        this.fishes = JSON.parse(
          s.substring(s.indexOf('['), s.indexOf(']') + 1)
        );
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
      this.fishService
        .editFish({ _id: this.fishId, type: this.type, price: this.price })
        .subscribe(
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
      this.fishService
        .addFish({
          type: this.type,
          price: this.price
        })
        .subscribe(
          data => {
            let s = JSON.stringify(data);
            this.fishes.push(
              JSON.parse(
                s.substring(s.indexOf('{"imgUrl"'), s.indexOf('}}') + 1)
              )
            );
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
