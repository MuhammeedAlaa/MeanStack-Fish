import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { OrderComponent } from './component/order/order.component';
import { FishComponent } from './component/fish/fish.component';
import { UserComponent } from './component/user/user.component';
import { AdminComponent } from './component/admin/admin.component';
import { DayComponent } from './component/day/day.component';
import { AmountComponent } from './component/amount/amount.component';
import { NotFoundComponent } from './component/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'fishes', component: FishComponent },
  { path: 'users', component: UserComponent },
  { path: 'admins', component: AdminComponent },
  { path: 'days', component: DayComponent },
  { path: 'amounts', component: AmountComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
