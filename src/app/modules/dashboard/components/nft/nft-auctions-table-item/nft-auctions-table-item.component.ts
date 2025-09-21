import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Task } from '../../../models/task';

@Component({
    selector: '[nft-auctions-table-item]',
    templateUrl: './nft-auctions-table-item.component.html',
    standalone: true,
    imports: [AngularSvgIconModule],
})
export class NftAuctionsTableItemComponent implements OnInit {
  @Input() task = <Task>{};

  constructor() {}

  ngOnInit(): void {}
}
