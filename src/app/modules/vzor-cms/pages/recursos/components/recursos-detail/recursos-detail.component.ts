import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { toast } from 'ngx-sonner';
import { RecursosService } from '../../../../services/recursos.service';
import { Recurso } from '../../../../models/recursos.model';

@Component({
  selector: 'app-recursos-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule],
  templateUrl: './recursos-detail.component.html',
  styleUrl: './recursos-detail.component.scss'
})
export class RecursosDetailComponent implements OnInit {
  recurso: Recurso | undefined;
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private recursosService = inject(RecursosService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recursosService.getRecursoById(parseInt(id)).subscribe({
        next: (recurso: Recurso | undefined) => {
          this.recurso = recurso;
        },
        error: (error: any) => {
          toast.error('Error al cargar el recurso');
          console.error(error);
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

}
