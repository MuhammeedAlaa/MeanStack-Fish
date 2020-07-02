import { Component } from '@angular/core';
import { MessagingService } from './services/massaging.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mazal El Khar';
  constructor (public messagingService: MessagingService) {}
  ngOnInit () {
    this.messagingService.requestPermission();
    this.messagingService.monitorRefresh();
    this.messagingService.receiveMessages();
  }
}
