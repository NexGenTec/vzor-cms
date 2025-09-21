import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-task-footer',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './task-footer.component.html',
  styleUrl: './task-footer.component.scss'
})
export class TaskFooterComponent {

}
