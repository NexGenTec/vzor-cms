import { Component, EventEmitter, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: '[app-user-header]',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss'
})
export class UserHeaderComponent {
   @Output() onCheck = new EventEmitter<boolean>();
  
    public toggle(event: Event) {
      const value = (event.target as HTMLInputElement).checked;
      this.onCheck.emit(value);
    }

}
