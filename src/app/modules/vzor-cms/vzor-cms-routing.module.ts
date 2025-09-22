import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { VzorCmsComponent } from './vzor-cms.component';
import { DashboardVzorCmsComponent } from './pages/dashboard-vzor-cms/dashboard-vzor-cms.component';
import { BlogComponent } from './pages/blog/blog.component';
import { RecursosComponent } from './pages/recursos/recursos.component';
import { ReviewClientesComponent } from './pages/review-clientes/review-clientes.component';
import { RecursosDetailComponent } from './pages/recursos/components/recursos-detail/recursos-detail.component';
import { ReviewDetailComponent } from './pages/review-clientes/components/review-detail/review-detail.component';
import { BlogDetailComponent } from './pages/blog/components/blog-detail/blog-detail.component';

const routes: Routes = [
  {
    path: '',
    component: VzorCmsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardVzorCmsComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'blog/:id', component: BlogDetailComponent },
      { path: 'recursos', component: RecursosComponent },
      { path: 'recursos/:id', component: RecursosDetailComponent },
      { path: 'review-clientes', component: ReviewClientesComponent },
      { path: 'review-clientes/:id', component: ReviewDetailComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VzorCmsRoutingModule {}
