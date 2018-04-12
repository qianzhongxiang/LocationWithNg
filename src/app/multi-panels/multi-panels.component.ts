import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
interface CateItem { class: string, title: string, code: string, disable?: boolean }

@Component({
  selector: 'app-multi-panels',
  templateUrl: './multi-panels.component.html',
  styleUrls: ['../../assets/font-custom.css', './multi-panels.component.css']
})

export class MultiPanelsComponent implements OnInit {
  Items: Array<CateItem>
  SelectedItem: CateItem
  constructor() { }

  ngOnInit() {
    this.Items = environment.multiPanelConfiguration.items;
  }
  Select(item: CateItem) {
    if (this.SelectedItem == item) {
      this.SelectedItem = undefined;
    } else
      this.SelectedItem = item;
  }
}
