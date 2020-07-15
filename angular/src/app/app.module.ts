import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

//Component
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { OrderComponent } from './component/order/order.component';
import { NotFoundComponent } from './component/not-found/not-found.component';

// external libraries
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ToastrModule } from 'ngx-toastr';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AsyncPipe } from '@angular/common';

//validattion
import { AuthService } from './services/auth.service';
import { ValidateService } from './services/validate.service';
import { HomeComponent } from './component/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { FishComponent } from './component/fish/fish.component';
import { AdminComponent } from './component/admin/admin.component';
import { UserComponent } from './component/user/user.component';
import { MessagingService } from './services/massaging.service';
import { DayComponent } from './component/day/day.component';
import { AmountComponent } from './component/amount/amount.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    OrderComponent,
    NotFoundComponent,
    HomeComponent,
    NavbarComponent,
    FishComponent,
    AdminComponent,
    UserComponent,
    OrderComponent,
    DayComponent,
    AmountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlashMessagesModule.forRoot(),
    ToastrModule.forRoot(),
    Ng2SearchPipeModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    ValidateService,
    AuthService,
    DatePipe,
    MessagingService,
    AsyncPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
