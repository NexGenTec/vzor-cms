import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { VzorCmsComponent } from './vzor-cms.component';
import { DashboardVzorCmsComponent } from './pages/dashboard-vzor-cms/dashboard-vzor-cms.component';
import { BlogComponent } from './pages/blog/blog.component';
import { RecursosComponent } from './pages/recursos/recursos.component';
import { ReviewClientesComponent } from './pages/review-clientes/review-clientes.component';

const routes: Routes = [
  {
    path: '',
    component: VzorCmsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardVzorCmsComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'recursos', component: RecursosComponent },
      { path: 'review-clientes', component: ReviewClientesComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VzorCmsRoutingModule {}
