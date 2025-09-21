import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ConstructoraComponent } from './constructora.component';
import { DashboardConstructoraComponent } from './page/dashboard-constructora/dashboard-constructora.component';
import { ProjectComponent } from './page/project/project.component';
import { TeamComponent } from './page/team/team.component';
import { ProductComponent } from './page/product/product.component';
import { TaskComponent } from './page/task/task.component';

const routes: Routes = [
  {
    path: '',
    component: ConstructoraComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardConstructoraComponent },
      { path: 'projects', component: ProjectComponent },
      { path: 'teams', component: TeamComponent },
      { path: 'products', component: ProductComponent },
      { path: 'tasks', component: TaskComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConstructoradRoutingModule {}