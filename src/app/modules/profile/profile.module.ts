import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { NgModule } from '@angular/core';


@NgModule({
   imports: [
      ProfileRoutingModule,
      CommonModule],
    providers: [
      { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    ],   
})
export class ProfileModule { }
