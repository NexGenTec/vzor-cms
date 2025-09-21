import { NgModule } from '@angular/core';
import { ErrorRoutingModule } from './error-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpErrorInterceptor } from '../dashboard/interceptor/http-error.interceptor.service';

@NgModule({ declarations: [], imports: [ErrorRoutingModule, AngularSvgIconModule.forRoot()], 
    providers: [provideHttpClient(withInterceptorsFromDi()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
          }
    ] })
export class ErrorModule {}
