import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../auth/guard/auth.guard';

const routes: Routes = [
  {
    path: 'components',
    component: LayoutComponent,
    loadChildren: () => import('../uikit/uikit.module').then((m) => m.UikitModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'management',
    component: LayoutComponent,
    loadChildren: () => import('../management/management.module').then((m) => m.ManagementModule),
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'chat',
  //   component: LayoutComponent,
  //   loadChildren: () => import('../chat/chat.module').then((m) => m.ChatModule),
  //   canActivate: [AuthGuard],
  // },
  {
    path: 'profile',
    component: LayoutComponent,
    loadChildren: () => import('../profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'vzor-cms',
    component: LayoutComponent,
    loadChildren: () => import('../vzor-cms/vzor-cms.module').then((m) => m.VzorCmsModule),
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'vzor-cms', pathMatch: 'full' },  
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
