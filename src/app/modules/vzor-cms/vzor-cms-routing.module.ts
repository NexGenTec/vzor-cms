import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { VzorCmsComponent } from './vzor-cms.component';
import { DashboardVzorCmsComponent } from './pages/dashboard-vzor-cms/dashboard-vzor-cms.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogFormComponent } from './pages/blog/components/blog-form/blog-form.component';
import { ReviewClientesComponent } from './pages/review-clientes/review-clientes.component'; //TODO: eliminar
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
      { path: 'blog/new', component: BlogFormComponent },
      { path: 'blog/edit/:id', component: BlogFormComponent },
      { path: 'blog/:id', component: BlogDetailComponent },
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
