import { HistoryService } from './../../../service/history.service';
import { AssetInfo } from './../../../../utilities/entities';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-option-panel',
  templateUrl: './option-panel.component.html',
  styleUrls: ['./option-panel.component.css']
})
export class OptionPanelComponent implements OnInit {
  CurrentDevice: AssetInfo
  STime: Date
  ETime: Date
  constructor(private historyService: HistoryService) { }

  ngOnInit() {
  }

  public Search() {
    this.historyService.GetData(this.CurrentDevice.Uid, this.CurrentDevice.Type, this.STime, this.ETime);
  }
}
