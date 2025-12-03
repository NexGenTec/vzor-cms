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
import { RecursosComponent } from './pages/recursos/recursos.component';
import { RecursosFormComponent } from './pages/recursos/components/recursos-form/recursos-form.component';
import { RecursosDetailComponent } from './pages/recursos/components/recursos-detail/recursos-detail.component';
import { FAQComponent } from './pages/faq/faq.component';
import { FAQFormComponent } from './pages/faq/components/faq-form/faq-form.component';
import { PlatformsComponent } from './pages/platforms/platforms.component';
import { PlatformFormComponent } from './pages/platforms/components/platform-form/platform-form.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ClientFormComponent } from './pages/clients/components/client-form/client-form.component';
import { ClientDetailComponent } from './pages/clients/components/client-detail/client-detail.component';
import { PartnersComponent } from './pages/partners/partners.component';
import { PartnerFormComponent } from './pages/partners/components/partner-form/partner-form.component';
import { PartnerDetailComponent } from './pages/partners/components/partner-detail/partner-detail.component';
import { FaqDetailComponent } from './pages/faq/components/faq-detail/faq-detail.component';
import { PlatformDetailComponent } from './pages/platforms/components/platform-detail/platform-detail.component';

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
      { path: 'recursos', component: RecursosComponent },
      { path: 'recursos/new', component: RecursosFormComponent },
      { path: 'recursos/edit/:id', component: RecursosFormComponent },
      { path: 'recursos/:id', component: RecursosDetailComponent },
      { path: 'faq', component: FAQComponent },
      { path: 'faq/new', component: FAQFormComponent },
      { path: 'faq/edit/:id', component: FAQFormComponent },
      { path: 'faq/:id', component: FaqDetailComponent },
      { path: 'platforms', component: PlatformsComponent },
      { path: 'platforms/new', component: PlatformFormComponent },
      { path: 'platforms/edit/:id', component: PlatformFormComponent },
      { path: 'platforms/:id', component: PlatformDetailComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'clients/new', component: ClientFormComponent },
      { path: 'clients/edit/:id', component: ClientFormComponent },
      { path: 'clients/:id', component: ClientDetailComponent },
      { path: 'partners', component: PartnersComponent },
      { path: 'partners/new', component: PartnerFormComponent },
      { path: 'partners/edit/:id', component: PartnerFormComponent },
      { path: 'partners/:id', component: PartnerDetailComponent },
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
export class VzorCmsRoutingModule { }
