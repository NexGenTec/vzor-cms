import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { LayoutRoutingModule } from './layout-routing.module';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../../../environments/environment.prod';
@NgModule({ 
    imports: [LayoutRoutingModule, AngularSvgIconModule.forRoot()], 
    providers: [provideHttpClient(withInterceptorsFromDi()), { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }],
})
export class LayoutModule {}
