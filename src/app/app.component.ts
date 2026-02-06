import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from './core/services/theme.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster,RouterModule],
})
export class AppComponent {
  title = ' vzor-cms';
  
  constructor(
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Solo ejecutar en el navegador, no en el servidor
    if (isPlatformBrowser(this.platformId)) {
      // Hacer el método disponible globalmente para debugging
      (window as any).checkDatabaseConnection = () => {
        console.log('🔧 Para verificar la conexión, ve a la consola y busca los logs automáticos de Firebase');
      };
      
      console.log('🔧 Para verificar la conexión a la base de datos, revisa los logs automáticos en la consola');
    }
  }
}
