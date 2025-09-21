import { Component, Input } from '@angular/core';
import { Task } from '../../../../../dashboard/models/task';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: '[app-constructora-auctions-table-item]',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './constructora-auctions-table-item.component.html',
  styleUrl: './constructora-auctions-table-item.component.scss'
})
export class ConstructoraAuctionsTableItemComponent {
  @Input() task = <Task>{};

  constructor() {}

  ngOnInit(): void {}
}
