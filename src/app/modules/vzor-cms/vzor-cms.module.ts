import { NgModule } from '@angular/core';
import { VzorCmsRoutingModule } from './vzor-cms-routing.module';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    VzorCmsRoutingModule,
    CommonModule
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }, 
  ],   
})
export class VzorCmsModule {}
