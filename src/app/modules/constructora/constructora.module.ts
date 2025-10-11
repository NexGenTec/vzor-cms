import { NgModule } from '@angular/core';
import { ConstructoradRoutingModule } from './constructora-routing.module';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    ConstructoradRoutingModule,
    CommonModule],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }, 
  ],   
  
})
export class ConstructoradModule {}
