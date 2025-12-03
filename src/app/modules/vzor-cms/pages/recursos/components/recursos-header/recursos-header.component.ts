import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: '[app-recursos-header]',
    standalone: true,
    imports: [CommonModule, FormsModule, AngularSvgIconModule],
    templateUrl: './recursos-header.component.html',
    styleUrl: './recursos-header.component.scss'
})
export class RecursosHeaderComponent {
    @Output() onCheck = new EventEmitter<boolean>();

    onCheckChange(event: any) {
        this.onCheck.emit(event.target.checked);
    }
}
