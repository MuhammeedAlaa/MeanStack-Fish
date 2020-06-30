import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  admins: any;
  order: string;
  constructor () {
    this.admins = [{ name: 'a' }, { name: 'b' }];
  }

  ngOnInit (): void {}
}
