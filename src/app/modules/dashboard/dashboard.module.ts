import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../../../environments/environment.prod';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    DashboardRoutingModule,
    CommonModule],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.nexgen },
  ],   
  
})
export class DashboardModule {}
