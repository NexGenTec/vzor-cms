import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TaskComponent } from './pages/task/task.component';
import { ProductComponent } from './pages/product/product.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { NftComponent } from './pages/nft/nft.component';
import { ProfileProductComponent } from './components/product/profile-product/profile-product.component';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserComponent } from '../management/page/user/user.component';
import { ProfileTaskComponent } from './components/task/profile-task/profile-task.component';
import { ProfileTicketComponent } from './components/ticket/profile-ticket/profile-ticket.component';
import { CalendarComponent } from './pages/calendar/calendar.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: NftComponent },
      { path: 'task', component: TaskComponent },
      { path: 'product', component: ProductComponent },
      { path: 'product/:id', component: ProfileProductComponent }, 
      { path: 'task/:id', component: ProfileTaskComponent }, 
      { path: 'ticket/:id', component: ProfileTicketComponent }, 
      { path: 'ticket', component: TicketComponent },
      { path: 'users', component: UserComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
